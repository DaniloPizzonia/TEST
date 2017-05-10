#pragma strict

var charge = 0.0;
var maxCharge = 30.0;
var chargeRate = 0.5;
private var lastCharge = -1.0;
private var caster : CombatMagicControl;

var force = 50.0;
var range = 10.0;
var angle = 45.0;

var damage = new DamageStats();
private var spell : MagicSpell;

var forceLayers : LayerMask;

function Start () {
	spell = GetComponent(MagicSpell);
}

function CastMagicNow (caster0 : CombatMagicControl) {
	caster = caster0;
	charge += chargeRate * Time.deltaTime;
	if (GetComponent(AudioSource)) {
		if (GetComponent.<AudioSource>().isPlaying == false) {
			GetComponent.<AudioSource>().Play();
			GetComponent.<AudioSource>().pitch = 1.0 + charge / maxCharge;
			GetComponent.<AudioSource>().loop = true;
		}
	}
	lastCharge = Time.time;
	FinalizeCharge();
}

function FinalizeCharge () {
	yield WaitForSeconds(0.051);
	if (Time.time > lastCharge + 0.05 || charge >= maxCharge) {
		if (GetComponent(AudioSource)) {
			GetComponent.<AudioSource>().Stop();
		}
		ForceDischarge();
	}
	else {
		return;
	}
}

function ForceDischarge () {
	if (charge > 0.0) {
		var cam = caster.sourcePos;
		var entity = caster.combatCtrl.entity;
		var pos = caster.sourcePos.position;
		var dir = caster.sourcePos.forward;
		var blow0 = (0.1 + charge / maxCharge);

		var dmg = new DamageStats();
		dmg.baseDamage = damage.baseDamage * (1.0 + blow0);
		dmg.armorPierce = damage.armorPierce;
		dmg.bluntDamage = damage.bluntDamage * (1.0 + blow0);
		dmg.heatDamage = damage.heatDamage * (1.0 + 0.5 * blow0);

		var colls = Physics.OverlapSphere(pos, range, forceLayers);
		if (colls && colls.length > 0) {
			for (var coll : Collider in colls) {
				// Don't add a force to ourselves!
				if (coll.gameObject != entity.gameObject || coll.transform.root.gameObject != entity.gameObject) {
					var collDir = coll.transform.position - pos;
					if (Vector3.Angle(collDir, dir) < angle) {
						// Get a rigidbody to push around:
						var rig : Rigidbody;
						if (coll.gameObject.GetComponent.<Rigidbody>()) {
							rig = coll.gameObject.GetComponent.<Rigidbody>();
						}
						else if (coll.transform.parent != null && coll.transform.parent.GetComponent.<Rigidbody>()) {
							rig = coll.transform.parent.GetComponent.<Rigidbody>();
						}
						if (rig != null) {
							var distMod = 1.0 / Mathf.Max(0.1, Vector3.Distance(pos, coll.transform.position));
							var blow = dir * blow0 * distMod;
							rig.AddForceAtPosition(blow * force, pos);
						}
						coll.gameObject.SendMessage("ApplyDamage", dmg, SendMessageOptions.DontRequireReceiver);
					}
				}
			}
		}
		charge = 0.0;
		if (spell.castFx != null) {
			Instantiate(spell.castFx, caster.effectPos.position, Quaternion.LookRotation(dir));
		}
	}
}


























