#pragma strict

var beamDelay = 0.1;

var force = 50.0;
var range = 10.0;

var damage = new DamageStats();
private var spell : MagicSpell;
var impactFx : Transform;

var forceLayers : LayerMask;

function Start () {
	spell = GetComponent(MagicSpell);
}

function CastMagicNow (caster : CombatMagicControl) {
	yield WaitForSeconds(beamDelay);

	var source = caster.sourcePos;
	var fxPos = caster.effectPos.position;

	var beam = Instantiate(spell.castFx, source.position, source.rotation);
	beam.transform.parent = source;
	beam.GetComponent(LineRenderer).SetPosition(0, fxPos);
	beam.GetComponent(LineRenderer).SetPosition(1, fxPos);

	var endPos = source.position + source.forward * 2500.0;

	var sourceDir = source.forward * 2500.0;
	var fxDir = endPos - fxPos;
	var startDir = Vector3.Project(fxDir, sourceDir);
	var startPos = endPos - startDir;

	var impactPos = source.position + source.forward * range;

	var ray : RaycastHit;
	if (Physics.Linecast(startPos, impactPos, ray, forceLayers)) {
		// Get some basic hit info:
		impactPos = ray.point;
		var coll = ray.collider;
		var distMod = Mathf.Clamp01(1.0 / Mathf.Pow(Mathf.Max(0.1, ray.distance-0.5), 2.0));

		// Get a rigidbody attached to this GO or one of its parents:
		var rig : Rigidbody;
		if (coll.gameObject.rigidbody) {
			rig = coll.gameObject.rigidbody;
		}
		else if (coll.transform.parent != null && coll.transform.parent.rigidbody) {
			rig = coll.transform.parent.rigidbody;
		}
		if (rig != null) {
			// We'll just make this an exponentially diminishing beam... (F = F0 / R²)
			var blow = fxDir.normalized * force * distMod;
			rig.AddForceAtPosition(blow, ray.point);
		}

		// Apply damage to target:
		var dmg = new DamageStats();
		dmg.baseDamage = damage.baseDamage * distMod;
		dmg.armorPierce = damage.armorPierce;
		dmg.bluntDamage = damage.bluntDamage * distMod;
		dmg.heatDamage = damage.heatDamage * distMod;
		coll.gameObject.SendMessage("ApplyDamage", dmg, SendMessageOptions.DontRequireReceiver);

		// And finally spawn some awesome burn FX:
		if (impactFx != null) {
			var ifx = Instantiate(impactFx, ray.point, Quaternion.LookRotation(ray.normal));
			ifx.transform.parent = ray.transform;
		}
	}

	// Last but not least, trace the beam we just fired:
	beam.GetComponent(LineRenderer).SetPosition(1, impactPos);
}




























