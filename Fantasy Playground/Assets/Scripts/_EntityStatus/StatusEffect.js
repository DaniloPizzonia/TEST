#pragma strict

/* Status effects on entities, especially players, describe things such
external factors influencing them or just behaviours manipulating
their overall stats. Examples would be damage over time (dot) or
debuffs caused by magic or injury. */

// Damage over time stats:		(!!!Can also heal!!!)
var dpsBasic = 0.0;		// Basic damage per second. No modifiers.	(ex.: Drowning, sustained injury)
var dpsBlunt = 0.0;		// Blunt weapon style damage per second.	(ex.: Bones shattering, crushing)
var dpsHeat = 0.0;		// Thermal damage per second.				(ex.: Fire damage, crtical temperature)

// Item durability effects:
var dpsArmor = 0.0;		// Armor durability loss per second.	(ex.: Corrosion magic, chemical damage)
var dpsWeapon = 0.0;	// Weapon durability loss per second.	(ex.: Corrosion magic, critical temperature)

// Magic over time stats:
var mpLoss = 0.0;		// Mana loss per second.				(ex.: Mana absorbing magic, mana powered buffs)
var mpRegenLoss = 0.0;	// Mana regeneration drop; constant.	(ex.: psychological effects, sustained injury)

// Biological effects:
var bloodLoss = 0.0;	// Blood loss per second. [%/s]			(ex.: Sustained injury, illness, vampires?)
var focusLoss = 0.0;	// Concentration loss per second. [%/s]	(ex.: Drug abuse, illness, emotional stress?)



//public class DamageStatusEffect extends StatusEffect {}