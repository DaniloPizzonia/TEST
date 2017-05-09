#pragma strict

var spineRotation : boolean = false;
var fpsCamera : boolean = true;

var curType : int = 0;			// 0=melee, 1=ranged, 2=magic.

var meleeCtrl : CombatMeleeControl;
var rangedCtrl : CombatRangedControl;
var magicCtrl : CombatMagicControl;
var inventoryCtrl : InventoryControl;
var interactCtrl : MouseInteraction;
var movement : SimpleMovement;

private var lastSwitch = 0.0;	// Duration of a weapon switch shouldn't exceed 1s.
private var running : boolean = false;
private var x = 0.0;
private var y = 0.0;
private var spineSingleAngle = 0.0;
var spineAngleMod = 1.0;
@System.NonSerialized
var aimDir = Vector3.forward;
var axisOffset : Vector3;
private var atkDir : Vector2;

var entity : Transform;
var arms : Animator;
var spines : Transform[] = new Transform[1];
var headPos : Transform;
var camFollowPos : Transform;
var cam : Camera;

function Start () {
	curType = 0;
	meleeCtrl.ToggleWeaponType(false);
	rangedCtrl.ToggleWeaponType(false);
	magicCtrl.ToggleWeaponType(false);
	lastSwitch = Time.time;
}

function Update () {
	var x0 = movement.xAcceleration.Evaluate(Input.GetAxis("Horizontal"));
	var y0 = movement.yAcceleration.Evaluate(Input.GetAxis("Vertical"));
	x = Mathf.Lerp(x, x0, Time.deltaTime * 3.0);
	y = Mathf.Lerp(y, y0, Time.deltaTime * 3.0);

	running = movement.running;

	arms.SetFloat("SpeedX", x);
	arms.SetFloat("SpeedY", y);
	arms.SetBool("Running", running);

	if (Time.time > lastSwitch + 1.0) {
		// Switch to melee weapons:
		if (Input.GetKeyDown("1")) {
			curType = 0;
			if (meleeCtrl.inUse == false) {
				meleeCtrl.ToggleWeaponType(true);
			}
			else {
				meleeCtrl.ToggleWeaponType(false);
			}
			rangedCtrl.ToggleWeaponType(false);
			magicCtrl.ToggleWeaponType(false);
			lastSwitch = Time.time;
		}
		// Switch to ranged weaponry:
		if (Input.GetKeyDown("2")) {
			curType = 1;
			if (rangedCtrl.inUse == false) {
				rangedCtrl.ToggleWeaponType(true);
			}
			else {
				rangedCtrl.ToggleWeaponType(false);
			}
			meleeCtrl.ToggleWeaponType(false);
			magicCtrl.ToggleWeaponType(false);
			lastSwitch = Time.time;
		}
		// Switch to magical spell casting:
		if (Input.GetKeyDown("3")) {
			curType = 2;
			if (magicCtrl.inUse == false) {
				magicCtrl.ToggleWeaponType(true);
			}
			else {
				magicCtrl.ToggleWeaponType(false);
			}
			meleeCtrl.ToggleWeaponType(false);
			rangedCtrl.ToggleWeaponType(false);
			lastSwitch = Time.time;
		}

		if (meleeCtrl.inUse == true || rangedCtrl.inUse == true) {
			// Close quarters standard attack and semi automatic fire mode:
			if (Input.GetMouseButtonDown(0)) {
				if (curType == 0) {
					if (Time.time > meleeCtrl.lastStrike + meleeCtrl.weapon.strikeRate * 0.75) {
						atkDir.x = -Mathf.Sign(atkDir.x);
						meleeCtrl.Strike();
					}
				}
				else if (curType == 1) {
					if (running == false && rangedCtrl.weapon != null && rangedCtrl.weapon.fullAuto == false) {
						rangedCtrl.Fire();
					}
				}
				running = false;
			}
			// Full auto fire mode for ranged weaponry:
			if (curType == 1 && rangedCtrl.weapon != null && rangedCtrl.weapon.fullAuto == true) {
				if (Input.GetMouseButton(0) && running == false) {
					rangedCtrl.Fire();
				}
			}
		}


		// Launch further melee attacks:
		if (curType == 0 && meleeCtrl.inUse == true) {
			if (Time.time > meleeCtrl.lastStrike + meleeCtrl.weapon.strikeRate * 0.75) {
				// Perform vertical slashes if right mouse was pressed:
				if (Input.GetMouseButtonDown(1)) {
					// Do alternating hit directions: (left-right-left-right-...)
					atkDir.y = -Mathf.Sign(atkDir.y);
					meleeCtrl.Strike();
				}
				if (Input.GetMouseButtonDown(2)) {
					atkDir = Vector2(0.0, 0.0);
					meleeCtrl.Strike();
				}
			}
			if (Time.time > meleeCtrl.lastStrike + meleeCtrl.weapon.strikeRate) {
				atkDir = Vector2.Lerp(atkDir, Vector2(0.0, 0.0), Time.deltaTime * 2.0);
			}
		}

		// Operate ranged weaponry:
		if (curType == 1 && rangedCtrl.inUse == true) {
			if (Input.GetKeyDown("r")) {
				rangedCtrl.Reload();
			}

			if (Input.GetMouseButton(1)) {
				// Record the time of when aiming started:
				if (rangedCtrl.aiming == false) {
					rangedCtrl.lastAimStart = Time.time;
				}
				// Start zooming/aiming:
				rangedCtrl.aiming = true;
				arms.SetBool("Aiming", true);
				// Find out wether we're already zoomed in max:
				if (Time.time > rangedCtrl.lastAimStart + 0.5) {
					rangedCtrl.fullAim = true;
				}
			}
			// Disable weapon aim:
			else {
				rangedCtrl.aiming = false;
				rangedCtrl.fullAim = false;
				arms.SetBool("Aiming", false);
			}

			if (rangedCtrl.fullAim == false && Vector3.Angle(rangedCtrl.weapon.transform.forward,cam.transform.forward)<15.0) {
				var aimPos = cam.transform.position + cam.transform.forward * 2500.0;
				var line : RaycastHit;
				if (Physics.Raycast(cam.transform.position, cam.transform.forward, line, 2500.0)) {
					aimPos = line.point;
				}
				aimDir = (aimPos - rangedCtrl.weapon.muzzle.position).normalized;
			}
			else {
				aimDir = rangedCtrl.weapon.muzzle.forward;
			}
		}

		// Cast magical spells:
		if (curType == 2 && magicCtrl.magicAllowed == true && magicCtrl.inUse == true && magicCtrl.spell != null) {
			// Cast one shot spells:		(summoning, fire balls, lightning, etc...)
			if (magicCtrl.spell.oneShot == true) {
				if (Input.GetMouseButtonDown(0)) {
					magicCtrl.CastSpell();
				}
			}
			// Or cast continuous magic:	(telekinesis, plasma beams, charging up, etc...)
			else {
				if (Input.GetMouseButton(0)) {
					magicCtrl.CastSpell();
				}
			}
		}
	}

	// Regenerate mana over time:
	if (magicCtrl != null && !Input.GetMouseButton(0)) {
		var mana = magicCtrl.manaReserves;
		mana += magicCtrl.manaRegeneration * Time.deltaTime;
		magicCtrl.manaReserves = Mathf.Clamp(mana, 0.0, magicCtrl.maxManaReserves);
	}


	// Open or close the inventory:
	if (inventoryCtrl != null) {
		if (inventoryCtrl.opened == true) {
			// No weapons can be active while searching the inventory:
			if (meleeCtrl.inUse == true || rangedCtrl.inUse == true || magicCtrl.inUse == true) {
				meleeCtrl.ToggleWeaponType(false);
				rangedCtrl.ToggleWeaponType(false);
				magicCtrl.ToggleWeaponType(false);
			}
			// Also, disable environemnt interaction:
			if (interactCtrl != null) {
				interactCtrl.allowInteract = false;
			}
		}
		else {
			// Allow interaction again if inventory is not in use:
			if (interactCtrl != null) {
				interactCtrl.allowInteract = true;
			}
		}

		// Open or close the inventory:
		if (Input.GetKeyDown("i")) {
			if (inventoryCtrl.opened == true) {
				inventoryCtrl.opened = false;
			}
			else {
				inventoryCtrl.opened = true;
			}
		}
	}


	arms.SetFloat("AttackDirX", atkDir.x);
	arms.SetFloat("AttackDirY", atkDir.y);

	if (rangedCtrl.inUse == true && rangedCtrl.aiming == true && running == false) {
		var aimCamPos = rangedCtrl.weapon.aimCamPos.position;
		if (rangedCtrl.fullAim == false) {
			var camPos = Vector3.Lerp(cam.transform.position, aimCamPos, Time.deltaTime * 2.0);
			cam.transform.position = camPos;
		}
		else {
			cam.transform.position = aimCamPos;
		}
	}
	else {
		if (fpsCamera == true) {
			cam.transform.position = headPos.position;
		}
		else {
			cam.transform.position = camFollowPos.position;		
		}
	}
}

function LateUpdate () {
	if (spineRotation == true && arms.enabled == true) {
		var split = spines.length * 1.0;
		var angleOffset = Vector3.Angle(cam.transform.forward, entity.transform.up) - 90.0;
		var singleAngle = angleOffset / split;
		spineSingleAngle = Mathf.Lerp(spineSingleAngle, singleAngle, Time.deltaTime * 10.0);
		for (var spine : Transform in spines) {
			if (spine != null) {
				var axis = spine.InverseTransformDirection(entity.right + entity.TransformDirection(axisOffset));
				spine.Rotate(axis * spineSingleAngle * spineAngleMod);
			}
		}
	}
}



























