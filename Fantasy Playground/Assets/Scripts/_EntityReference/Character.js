#pragma strict

public class Character extends Entity {

	// Character specific data:
	var charSize = Vector2(0.5, 1.5);
	var charCenter : Vector3;
	
	// Character references and behaviours:
	var charStats : CharacterStats;
	var inventory : CharacterInventory;
	var interaction : CharacterInteraction;
	

	function Start () {
	}

	function OnDrawGizmos () {
		Gizmos.color = Color(1.0, 1.0, 0.0, 0.5);
		var box = Vector3(charSize.x, charSize.y, charSize.x);
		Gizmos.DrawWireCube(transform.position + transform.TransformDirection(charCenter), box);
	}
}