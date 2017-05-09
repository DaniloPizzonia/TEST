#pragma strict

var oneShot : boolean = true;	// Cast once only or allow continuous use? (aka semi vs. auto)

var manaUse = 10.0;				// The amount of mana used. Either at once [U] or per second [U/s].
var castRate = 0.6;				// Minimum cooldown between successive casts for one shot spells. [s]

var idleFx : Transform;			// Magic effect visible on the character. (To visualize spell choice)
var chargeFx : Transform;		// Magic effect indicating preparation to cast.
var castFx : Transform;			// Magic effect spawned upon casting.

var effect : MonoBehaviour;		// The actual trick behind the magic. Can be anything...