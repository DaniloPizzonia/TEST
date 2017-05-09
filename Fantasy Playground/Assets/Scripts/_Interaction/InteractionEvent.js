#pragma strict

var eventCtrl : MonoBehaviour;

var description : String = "Interaction (use)";

private var lastUse = 0.0;
var interactRate = 0.25;

function Start () {

}

function RequestInteraction (user : GameObject) {
	if (eventCtrl != null && Time.time > lastUse + interactRate) {
		Debug.Log("Interaction Event requested");
		eventCtrl.SendMessage("StartInteraction", user, SendMessageOptions.DontRequireReceiver);
		lastUse = Time.time;
	}
}