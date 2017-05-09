#pragma strict

var oldScale = 1.0;
var newScale = 2.0;
private var rescale = 2.0;

function Start () {
}

@ContextMenu ("Recalculate rescaled object positions")
function RecalculateRescaledObjectPositions () {
	rescale = newScale / oldScale;
	var pos = transform.position;

	var children = gameObject.GetComponentsInChildren(Transform);
	for (var child : Component in children) {
		var trans = child.transform;
//		Debug.Log("Child object found: " + trans.name);
		if (child.gameObject.tag != "SubCollider") {
			var oldOffset = trans.position - pos;
			var newOffset = oldOffset * rescale;

			trans.position = pos + newOffset;
		}
	}
}