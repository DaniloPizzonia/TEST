#pragma strict

var display : boolean = true;
var root : Transform;

function Start () {

}

function OnDrawGizmosSelected () {
	Gizmos.color = Color.red;
	if (root != null && display == true) {
		var bones = root.GetComponentsInChildren(Transform);
		for (var b0 : Component in bones) {
			var b = b0.transform;
			if (b != root) {
				Gizmos.DrawLine(b.position, b.parent.position);
			}
		}
	}
}