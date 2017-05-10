#pragma strict

var launchSpeed = 20.0;

var projectile : Rigidbody;

function Start () {

}

function CastMagicNow (caster : CombatMagicControl) {
	var cam = caster.combatCtrl.cam.transform;
	var proj = Instantiate(projectile, caster.effectPos.position, cam.rotation);
	Physics.IgnoreCollision(caster.combatCtrl.entity.GetComponent(CharacterController), proj.GetComponent(Collider));
	proj.GetComponent.<Rigidbody>().velocity = proj.transform.forward * launchSpeed;
}