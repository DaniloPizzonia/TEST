#pragma strict

var entityName : String = "Entity";
var entityFaction : String = "";
@System.NonSerialized
var entityTag : String = "Untagged";
var entityDescript : String = "-";

function Start () {
	entityTag = gameObject.tag;
}