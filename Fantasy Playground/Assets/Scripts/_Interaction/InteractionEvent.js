#pragma strict

var eventCtrl : MonoBehaviour;

var description : String = "Interaction (use)";

private var lastUse = 0.0;
var interactRate = 0.25;

function Start () {

}

function RequestInteraction (user : Character) {
	if (eventCtrl != null && Time.time > lastUse + interactRate) {
		Debug.Log("Interaction Event requested. User type; " + user.GetType().ToString());
		eventCtrl.SendMessage("StartInteraction", user, SendMessageOptions.DontRequireReceiver);
		lastUse = Time.time;
	}
}