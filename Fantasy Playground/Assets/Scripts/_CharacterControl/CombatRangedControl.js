#pragma strict

var inUse : boolean = false;			// Is the current weapon type equiped/active right now?
var aiming : boolean = false;			// Are we aiming down sights right now?
var animationDriven : boolean = false;	// Use animation events to control firing delay?
@System.NonSerialized
var fullAim : boolean = false;			// Is the camera perfectly aligned with the weapon's sights?

var weapon : WeaponRanged;
var weaponPos : Transform;
var holsterPos : Transform;

private var lastShot = 0.0;
private var lastReload = 0.0;
@System.NonSerialized
var lastAimStart = 0.0;

var combatCtrl : CombatControl;
var ballistics : BallisticsPlotter;

function Start () {
	ballistics = GameObject.FindWithTag("Ballistics").gameObject.GetComponent(BallisticsPlotter);
	if (inUse == false) {
		HolsterWeapon();
	}
	else {
		DrawWeapon();
	}
}

function OnDrawGizmos () {
	if (weapon != null) {
		Gizmos.color = Color.red;
		Gizmos.DrawRay(weapon.muzzle.position, combatCtrl.aimDir);
	}
}

function ToggleWeaponType (on : boolean) {
	inUse = on;
	if (combatCtrl.arms != null) {
		combatCtrl.arms.SetBool("Ranged", on);
	}
}

function Fire () {
	if (weapon != null && Time.time > lastShot+weapon.fireRate && Time.time > lastReload+weapon.reloadDur && weapon.ammo > 0) {
		combatCtrl.arms.SetBool("Attack", true);
		StopAttackAnimation(Time.time, weapon.fireRate);
		lastShot = Time.time;

		if (animationDriven == false) {
			FireShot();
		}
	}
}

function FireShot () {
	// Request an external trajectory calculation:
	// (This has to be done outside of this GO, to avoid disappearing shots once this GO was destroyed!)
	var plotCurve = new BallisticStep();

	plotCurve.stepsLeft = Mathf.Max(1, weapon.castSteps);
	plotCurve.stepPos = weapon.muzzle.position;
	var spreadAng = Random.Range(-Mathf.PI, Mathf.PI);
	var spreadDir = weapon.transform.right * Mathf.Cos(spreadAng) + weapon.transform.up * Mathf.Sin(spreadAng);
	var spreadRange = Random.Range(-weapon.spread, weapon.spread);
	plotCurve.stepDir = combatCtrl.aimDir + spreadDir * Mathf.Tan(Mathf.Min(89.0, spreadRange) * Mathf.Deg2Rad);
	var playerSpeed = combatCtrl.movement.GetComponent(CharacterController).velocity;
	var bulletSpeed = playerSpeed + plotCurve.stepDir.normalized * weapon.projSpeed;
	plotCurve.stepDir = bulletSpeed.normalized;
	plotCurve.stepTime = Time.time;
	plotCurve.stepDelay = (ballistics.maxStepLength / weapon.castSteps) / weapon.projSpeed;

//	plotCurve.projSpeed = weapon.projSpeed;
	plotCurve.projSpeed = bulletSpeed.magnitude;
	plotCurve.projMass = weapon.projMass;

	plotCurve.impactFx = weapon.impactFx;

	plotCurve.baseDamage = weapon.damage.baseDamage;
	plotCurve.armorPierce = weapon.damage.armorPierce;
	plotCurve.bluntDamage = weapon.damage.bluntDamage;
	plotCurve.heatDamage = weapon.damage.heatDamage;

	plotCurve.ricochetProba = weapon.damage.ricochetProba;

	ballistics.PlotNewCurve(plotCurve);

	// Spawn a muzzle flash or similar effect at the gun barrel:
	if (weapon.muzzleFx != null) {
		var mfx = Instantiate(weapon.muzzleFx, weapon.muzzle.position, weapon.muzzle.rotation);
	}
	// Play a fire sound:
	if (weapon.fireSound != null) {
		GetComponent.<AudioSource>().PlayOneShot(weapon.fireSound);
	}

	// Reduce ammo count:
	weapon.ammo --;
}

function Reload () {
	if (weapon != null && Time.time > lastReload + weapon.reloadDur) {
		aiming = false;
		combatCtrl.arms.SetBool("Reload", true);
		StopReloadAnimation(Time.time, weapon.fireRate);
		weapon.ammo = weapon.maxAmmo;	// [placeholder script!]

		// Play a reload sound:
		if (weapon.reloadSound != null) {
			GetComponent.<AudioSource>().PlayOneShot(weapon.reloadSound);
		}

		lastReload = Time.time;
	}
}

function StopAttackAnimation (t : float, r : float) {
	yield WaitForSeconds(r);
	if (t + r > lastShot) {
		combatCtrl.arms.SetBool("Attack", false);
	}
}
function StopReloadAnimation (t : float, d : float) {
	yield WaitForSeconds(d);
	if (t + d > lastReload) {
		combatCtrl.arms.SetBool("Reload", false);
	}
}

function HolsterWeapon () {
	weapon.transform.position = holsterPos.position;
	weapon.transform.rotation = holsterPos.rotation;
	weapon.transform.parent = holsterPos;
}
function DrawWeapon () {
	weapon.transform.position = weaponPos.position;
	weapon.transform.rotation = weaponPos.rotation;
	weapon.transform.parent = weaponPos;
}

function SwitchWeapon (newWep : WeaponRanged) {
	var oldWep : WeaponRanged;
	var nt = newWep.transform;
	// Dispose of our previous weapon:
	if (weapon != null) {
		// Place it where the new weapon was: (avoids glitching & physics bugs)
		oldWep = weapon;
		oldWep.transform.position = nt.position;
		oldWep.transform.rotation = nt.rotation;
		// Reassign parenting of the previous weapon:
		if (nt.parent != null) {
			oldWep.transform.parent = nt.parent;
		}
		else {
			oldWep.transform.parent = null;
		}
		// Unequip previous weapon:
		oldWep.GetComponent(Item).Equipped(false);
	}
	weapon = null;
	// Assign the new weapon to the character:
	var pos = weaponPos;
	if (inUse == false) {
		pos = holsterPos;
	}
	nt.position = pos.position;
	nt.rotation = pos.rotation;
	nt.parent = pos;
	// Define the new weapon as our active weapon of this type:
	weapon = newWep;
}


















