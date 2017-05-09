#pragma strict

public class WeaponRanged extends Item {

	var fullAuto : boolean = false;

	var ammo : int = 1;
	var maxAmmo : int = 1;

	var damage : DamageStats = new DamageStats();

	var spread = 0.5;				// Bullet heading deviation angle. [°]
	var fireRate = 0.3;				// Rate of fire of this weapon, aka time between shots. [s]
	var reloadDur = 1.0;			// Time it takes to reload this weapon. [s]
	var projSpeed = 50.0;			// Muzzle velocity of this weapon. [m/s]
	var projMass = 0.2;				// Mass of the fired projectile. [kg]
	var castSteps : int = 4;		// How many raycasts will best approximate the ballistic curve of the weapon.
	var aimZoomFOV = 50.0;			// Field of view angle when aiming down sights. [°]

	var muzzle : Transform;			// Muzzle tip of this gun. (aka where the projectile leaves the weapon)
	var aimCamPos : Transform;		// Camera location (fps view) when aiming down sights. (behind iron sight, etc...)
	var muzzleFx : GameObject;		// Visual effect to spawn at the muzzle when a shot is fired.
	var impactFx : Transform;		// Impact effect to spawn where a target was hit. (sparks, dust, etc...)

	var fireSound : AudioClip;		// Sound to be played when firing the weapon.
	var reloadSound : AudioClip;	// Sound to be played when reloading the weapon.

	function Start () {
		if (muzzle == null) {
			muzzle = transform;
		}
		if (aimCamPos == null) {
			aimCamPos = muzzle;
		}

		itemType = ItemTypes.WeaponRanged;

		var rfDmg = Mathf.Ceil(Mathf.Sqrt(Mathf.Pow(damage.baseDamage, 2.0)
		+ Mathf.Pow(damage.bluntDamage, 2.0) + damage.heatDamage));
		var raDmg = Mathf.Ceil(damage.armorPierce * 100.0);
		entityDescript += ("\n\n<b>Damage:</b>\nFlesh: <b>" + rfDmg + "</b> Armor: <b>" + raDmg + "</b>");
		entityDescript += ("\nRate: <b>" + (1.0 / fireRate) + "</b>  Ammo: <b>" + ammo + "/" + maxAmmo + "</b>");
	}
}