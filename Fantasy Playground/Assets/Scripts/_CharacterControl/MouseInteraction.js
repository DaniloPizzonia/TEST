#pragma strict

public class MouseInteraction extends CharacterInteraction {

	var cam : Camera;
	var combatCtrl : CombatControl;

	private var lastCheck = 0.0;
	private var inputStart = 0.0;
	private var event : InteractionEvent;
	private var item : Item;
	private var observeMode : boolean = false;
	
	var menuCtrl : InterfaceMenu;
	
	var interCanvas : Canvas;
	var interBoxTxt : UI.Text;
	var interBoxIcon : UI.Image;
	var observeCanvas : Canvas;
	var observeTxt : UI.Text;
	var observeIcon : UI.Image;


	function Start () {
	
	}

	function OnDrawGizmos () {
		if (cam != null) {
			Gizmos.color = Color.green;
			Gizmos.DrawRay(cam.transform.position, cam.transform.forward * interactRange);
		}
	}

	function Update () {
		if (menuCtrl.opened == false && allowInteract == true && cam != null && Time.time > lastCheck + 0.15) {
			var ray : RaycastHit;
			if (Physics.Raycast(cam.transform.position, cam.transform.forward, ray, interactRange)) {
				if (ray.collider.gameObject.GetComponent(InteractionEvent)) {
					if (event == null) {
						// The event was previously undefined, but not anymore. Time to show the UI:
						UiToggleInteractWindow(true);
					}
					event = ray.collider.gameObject.GetComponent(InteractionEvent);
					item = null;
				}
				else {
					event = null;
					if (ray.collider.gameObject.GetComponent(Item)) {
						if (item == null) {
							// The item was previously undefined, but not anymore. Time to show the UI:
							UiToggleInteractWindow(true);
						}
						// Define a new item that we're considering now:
						item = ray.collider.gameObject.GetComponent(Item);
					}
					else {
						item = null;
					}
				}
			}
			else {
				// Nothing in sight, reset all interactive objects:
				event = null;
				item = null;
				// No item or event is visible, time to disable UI:
				UiToggleInteractWindow(false);
			}
			// Repeat after a while:
			lastCheck = Time.time;
		}

		if (allowInteract == true && observeMode == false && Input.GetKeyDown("e")) {
			inputStart = Time.time;
		}
		// If the "e" key is pressed for a little longer, observe the target more closely:
		if (Input.GetKey("e") && Time.time - inputStart >= 0.3) {
			if (observeMode == false) {
				// Call to terminate observation mode a while after start:
				PassiveInteraction();
			}
			UiUpdateInteractWindows();
			observeMode = true;
		}
		// If the "e" key is released earlier, invoke a normal interaction:
		if (Input.GetKeyUp("e")) {
			if (Time.time - inputStart < 0.3) {
				DirectInteraction();
				// Also, end observation mode when interacting:
				observeMode = false;
			}
		}

		// Don't need to show any further stuff if no interaction is going on:
		if (event == null && item == null) {
			// Disable any UI that's still active now:
			if (observeMode == true) {
				UiToggleObserveWindow(false);
			}
			observeMode = false;
		}
	}

	function DirectInteraction () {
		if (event != null) {
			event.SendMessage("RequestInteraction", user, SendMessageOptions.DontRequireReceiver);
		}
		else if (item != null) {
			item.SendMessage("Equipped", true, SendMessageOptions.DontRequireReceiver);
			ForwardItemToControls(item);
		}
		// Hide UI again, as we already interacted we the object:
		UiToggleInteractWindow(false);
		UiToggleObserveWindow(false);
	}
	// This function will end observation mode after a given time:
	function PassiveInteraction () {
		// Show us some more detailed info on UI:
		UiToggleObserveWindow(true);
		// [insert any observation mode FX here]

		// Terminate overservation mode after a while:
		yield WaitForSeconds(3.0);
		observeMode = false;
		UiToggleObserveWindow(false);
	}

	function ForwardItemToControls (it : Item) {
		// Relay item to all concerned parties. Distinguished by item type!
		if (item.itemType == Item.ItemTypes.WeaponMelee) {
			combatCtrl.meleeCtrl.SwitchWeapon(item.gameObject.GetComponent(WeaponMelee));
		}
		else if (item.itemType == Item.ItemTypes.WeaponRanged) {
			combatCtrl.rangedCtrl.SwitchWeapon(item.gameObject.GetComponent(WeaponRanged));
		}
		else if (item.itemType == Item.ItemTypes.Armor) {
		}
		else if (item.itemType == Item.ItemTypes.Collectable) {
			combatCtrl.inventoryCtrl.RequestAddItem(item);
		}
		else if (item.itemType == Item.ItemTypes.Objective) {
		}
		else {
		}
	}


	// Update all information displayed on any UI objects:
	function UiUpdateInteractWindows () {
		if (item != null) {
			// Get descriptions and icons:
			var interactIcon = item.itemIcon;
			// Update all text and icon objects on UI:
			interBoxTxt.text = item.entityName;
			observeTxt.text = item.entityName + "\n\n" + item.entityDescript;
			interBoxIcon.sprite = interactIcon;
			observeIcon.sprite = interactIcon;
		}
	}
	// Enable or disable UI displaying only the object name and icon:
	function UiToggleInteractWindow (show : boolean) {
		// Disable all overlapping UI before enabling:
		if (show == true) {
			UiToggleObserveWindow(false);
		}
		interCanvas.enabled = show;
	}
	// Enable or disable UI containing more detailed information:
	function UiToggleObserveWindow (show : boolean) {
		// Disable all overlapping UI before enabling:
		if (show == true) {
			UiToggleInteractWindow(false);
		}
		observeCanvas.enabled = show;
	}

}




/*	function OnGUI () {
		if (allowInteract == true) {
			if (event != null) {
				GUI.Label(Rect(Screen.width*.5, Screen.height*.75, 250.0, 45.0), event.description);
			}
			else if (item != null) {
				GUI.Label(Rect(Screen.width*.5, Screen.height*.75, 250.0, 45.0), "Pick up <b>" + item.entityName + "</b>");
			}

			// Show more item information in observation mode:
			if (observeMode == true) {
				if (item != null) {
					var descTxt = "<b>Info:</b>\n" + item.entityDescript;

					GUI.Label(Rect(Screen.width*.5, Screen.height*.75-120.0, 250.0, 120.0), descTxt);
				}
			}
		}
	}	*/














