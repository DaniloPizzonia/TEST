#pragma strict

var interaction : InteractionEvent;

private var open : boolean = false;
var openBothWays : boolean = false;

var openPos = 90.0;
var openInstruction : String = "Door (close)";
var closePos = 0.0;
var closeInstruction : String = "Door (open)";

private var joint : HingeJoint;
private var originDir = Vector3.forward;

function Start () {
	joint = gameObject.GetComponent(HingeJoint);
	joint.useSpring = true;
	joint.spring.targetPosition = closePos;
	interaction.description = closeInstruction;
	open = false;
	originDir = transform.forward;
}

function StartInteraction (user : Character) {
	if(joint == null)
		return;
	
	if (open == false) {
		var dirMod = 1.0;
		if (openBothWays == true && Vector3.Dot(transform.position - user.transform.position, originDir) < 0.0) {
			dirMod = -1.0;
		}
		joint.spring.targetPosition = openPos * dirMod;
		interaction.description = openInstruction;
		open = true;
	}
	else {
		joint.spring.targetPosition = closePos;
		interaction.description = closeInstruction;
		open = false;
	}
}