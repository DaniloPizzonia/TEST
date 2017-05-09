#pragma strict

var running : boolean = false;

var walkSpeed = 2.8;
var strafeSpeed = 2.3;
var runSpeed = 5.5;
@System.NonSerialized
var curSpeed = 2.8;

var xAcceleration = new AnimationCurve(Keyframe(-1.0, -1.0), Keyframe(0.0, 0.0), Keyframe(1.0, 1.0));
var yAcceleration = new AnimationCurve(Keyframe(-1.0, -1.0), Keyframe(0.0, 0.0), Keyframe(1.0, 1.0));

var x = 0.0;
var y = 0.0;
var moveDir : Vector3;
@System.NonSerialized
var ctrl : CharacterController;

var pushRigidbody : boolean = false;
var moverMass = 75.0;
var pushModifier = 0.1;

function Start () {
	ctrl = GetComponent(CharacterController);
	curSpeed = walkSpeed;
}

function OnControllerColliderHit (coll : ControllerColliderHit) {
	if (coll.rigidbody) {
		var collDir = coll.point - transform.position;
		var speed = ctrl.velocity;
		var angMod = Mathf.Abs(Vector3.Dot(speed, collDir));
		var momentum = speed.magnitude * moverMass;
		var force = momentum / Time.deltaTime * pushModifier * angMod;
		var forceDir = speed.normalized;
		coll.rigidbody.AddForceAtPosition(force * forceDir, coll.point);
	}
}

function Update () {
	x = Input.GetAxis("Horizontal");
	y = Input.GetAxis("Vertical");

	if (Input.GetKeyDown("left shift")) {
		if (running == false) {
			running = true;
		}
		else {
			running = false;
		}
	}
	if (running == true) {
		if (y >= 0.0) {
			curSpeed = runSpeed;
		}
		else {
			curSpeed = walkSpeed;
		}
	}
	else {
		curSpeed = walkSpeed;
	}
	if (Input.GetMouseButton(0)) {
		running = false;
	}
	if ((Mathf.Abs(x) <= 0.01 && Mathf.Abs(y) <= 0.01) && !Input.GetKey("left shift")) {
		running = false;
	}

	var xSpeed = xAcceleration.Evaluate(x);
	var ySpeed = yAcceleration.Evaluate(y);
	moveDir = Vector3(xSpeed, 0.0, ySpeed).normalized * Mathf.Max(Mathf.Abs(xSpeed), Mathf.Abs(ySpeed));

	var moveSpeed = Vector3.Scale(moveDir, Vector3(strafeSpeed, 1.0, curSpeed));
	var relMoveSpeed = transform.right * moveSpeed.x + transform.forward * moveSpeed.z;

	ctrl.SimpleMove(relMoveSpeed);
}