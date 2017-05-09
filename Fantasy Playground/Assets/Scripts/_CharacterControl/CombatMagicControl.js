#pragma strict

var inUse : boolean = false;		// Is the currently selected weapon type melee?
var magicAllowed : boolean = false;	// Can this character even use any magic?

var spell : MagicSpell;			// The spell we're about to use. (leave blank if no magic available)
var effectPos : Transform;		// The location where the spell's awesome FX will show on the character.

@System.NonSerialized
var lastCast = 0.0;				// Time of the last spell cast.
var manaReserves = 50.0;		// Amount of mana remaining. (aka magical energy)
var maxManaReserves = 50.0;		// Maximum amount of mana available to the character.
var manaRegeneration = 0.5;		// Amount of mana regenerated per second. [U/s]

var combatCtrl : CombatControl;	// The main combat control system of the character.
var sourcePos : Transform;		// The camera position or another reference point for spells. (raycasting etc...)

function Start () {
	if (magicAllowed == true) {
		if (inUse == false) {
			CancelMagic();
		}
		else {
			SummonMagic();
		}
	}
	else {
		CancelMagic();
	}
}

function ToggleWeaponType (on : boolean) {
	inUse = on;
	if (combatCtrl.arms != null) {
		combatCtrl.arms.SetBool("Magic", on);
	}
}

function CastSpell () {
	if (magicAllowed == true && spell != null) {	// Not all characters need magic...
		var oneShotConds = (Time.time > lastCast + spell.castRate && spell.oneShot == true && manaReserves >= spell.manaUse);
		var continuousConds = (spell.oneShot == false);
		if ((oneShotConds == true || continuousConds == true) && manaReserves >= 0.0) {
			if (combatCtrl.arms != null) {
				combatCtrl.arms.SetBool("Attack", true);
				StopAttackAnimation(Time.time);
			}
			// Summon some amazing magical powers:
			// (Can also be other supernatural stuff if you don't like magic.)
			spell.SendMessage("CastMagicNow", this);

			// Calculate mana drain:
			if (spell.oneShot == false) {
				manaReserves -= spell.manaUse * Time.deltaTime;
			}
			else {
				// Make sure one-shot spells can not be invoked continuously:
				lastCast = Time.time;
				manaReserves -= spell.manaUse;
			}
		}
	}
}

function StopAttackAnimation (t : float) {
	yield WaitForSeconds(0.11);
	if (t + 0.1 > lastCast) {
		combatCtrl.arms.SetBool("Attack", false);
	}
}


function CancelMagic () {
	// X X X
}
function SummonMagic () {
	// X X X
}































