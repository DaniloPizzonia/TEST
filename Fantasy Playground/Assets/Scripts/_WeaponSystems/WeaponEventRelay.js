#pragma strict

var weaponCtrl : CombatControl;
var meleeCtrl : CombatMeleeControl;
var rangedCtrl : CombatRangedControl;

function Start () {

}

function FireShot () {
	rangedCtrl.SendMessage("FireShot");
}
function RangedStrike () {	// For melee attachments on ranged weaponry. (ex: bayonet on rifle)
	rangedCtrl.SendMessage("ImpactDamage", SendMessageOptions.DontRequireReceiver);
}
function MeleeStrike () {
	meleeCtrl.SendMessage("ImpactDamage", Vector4(1.0, 0.7, 1.0, 0.85));
}
function MeleeStab () {
	meleeCtrl.SendMessage("ImpactDamage", Vector4(1.0, 2.0, 0.5, 1.0));
}

function DrawMelee () {
	meleeCtrl.DrawWeapon();
}
function SheathMelee () {
	meleeCtrl.SheathWeapon();
}
function DrawRanged () {
	rangedCtrl.DrawWeapon();
}
function HolsterRanged () {
	rangedCtrl.HolsterWeapon();
}