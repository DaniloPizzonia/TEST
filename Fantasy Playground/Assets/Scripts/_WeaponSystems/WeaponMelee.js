#pragma strict

public class WeaponMelee extends Item {

	var baseDamage = 3.0;
	var armorPierce = 0.2;
	var bluntDamage = 2.0;
	var heatDamage = 0.0;

	var strikeRate = 0.3;
	var damageRadius = 0.5;

	var damageCorePos : Transform;	// Location where a spherecast is made to emulate slashing damage.

	var impactFx : Transform;


	function Start () {
		itemType = ItemTypes.WeaponMelee;

		var mfDmg = Mathf.Ceil(Mathf.Sqrt(Mathf.Pow(baseDamage, 2.0) + Mathf.Pow(bluntDamage, 2.0) + heatDamage));
		var maDmg = Mathf.Ceil(armorPierce * 100.0);
		entityDescript += ("\n\n<b>Damage:</b>\nFlesh: <b>" + mfDmg + "</b> Armor: <b>" + maDmg + "</b>");
	}

	function OnDrawGizmosSelected () {
		if (damageCorePos != null) {
			Gizmos.color = Color(1.0, 0.5, 0.0, 0.75);
			Gizmos.DrawRay(damageCorePos.position - damageCorePos.up*damageRadius*.5, damageCorePos.up*damageRadius);
		}
	}
}