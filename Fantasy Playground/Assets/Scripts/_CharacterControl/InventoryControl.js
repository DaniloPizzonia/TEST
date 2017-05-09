#pragma strict
//using UnityEngine.UI;

public class InventoryControl extends CharacterInventory {

	var opened : boolean = false;

	var selected : int = 0;

	var combatCtrl : CombatControl;		// Serves as a general player interaction reference.
	var interfaceMenu : InterfaceMenu;
/*	private var interfaceStyle : InterfaceReference;	*/

	var invCanvas : Canvas;
	var invButton : UI.Button[] = new UI.Button[7];
	var invButtonTxt : UI.Text[] = new UI.Text[7];
	var invButtonIcon : UI.Image[] = new UI.Image[7];
	var invDescTxt : UI.Text;
	var invDescIcon : UI.Image;

	private var blankItemIcon : Sprite;
	private var missingItemIcon : Sprite;


	function Start () {
		selected = 0;
		blankItemIcon = interfaceMenu.blankItemIcon;
		missingItemIcon = interfaceMenu.missingItemIcon;
	}

	// UI CLUSTER!!!!!

	function UiToggleInventory (openNow : boolean) {
		if (openNow == true) {
			// Close any interfering UI elements:
			interfaceMenu.interactCtrl.UiToggleInteractWindow(false);	// (Interaction system)
			interfaceMenu.interactCtrl.UiToggleObserveWindow(false);
			// Update the content of all lists and descriptions:
			UiUpdateItemList();
			UiUpdateInventoryDescription();
		}
		invCanvas.enabled = openNow;
		opened = openNow;
	}

	function UiUpdateItemList () {
		for (var i : int; i<7; i++) {
			// Get the actual slot index we're referring to:
			var a = selected + i - 3;
			// Get the name and icon corresponding to the represented item:
			var itemName : String = "-";
			var itemIcon : Sprite;
			if (a >= 0 && a < slots.length && slots[a] != null) {
				itemName = slots[a].entityName;
				if (slots[a].itemIcon != null) {
					itemIcon = slots[a].itemIcon;
				}
			}

			// Update all UI information and icons:
			invButtonTxt[i].text = itemName;
			if (i >= 0 && i < 6) {
				if (itemIcon) {
					invButtonIcon[i].sprite = itemIcon;
				}
				else {
					invButtonIcon[i].sprite = blankItemIcon;
				}
			}
		}
	}
	function UiUpdateInventoryDescription () {
		var descIcon : Sprite = missingItemIcon;
		var descTxt : String = "<b>-</b>";
		if (selected >= 0 && selected < slots.length && slots[selected] != null) {
			descTxt = "<b>" + slots[selected].entityName + ":</b>\n\n";
			descTxt += slots[selected].entityDescript + "\n\nValue:  " + slots[selected].itemValue + "$";
			if (slots[selected].itemIcon != null) {
				descIcon = slots[selected].itemIcon;
			}
		}
		invDescTxt.text = descTxt;
		invDescIcon.sprite = descIcon;
	}

	function UiClickItemButton (index : int) {
		selected += (index - 3);
		selected = Mathf.Clamp(selected, 0, usedSlotCount-1);

		// Update the names and icons of the visible list:
		UiUpdateItemList();
		// Update the description panel of the selected item:
		UiUpdateInventoryDescription();
	}
	
	function UiDropItemButton () {
		RequestDropItem(slots[selected]);
		UiUpdateItemList();
		UiUpdateInventoryDescription();
	}
	function UiUseItemButton () {
//		RequestUseItem(slots[selected]);		[NOT IMPLEMENTED]
		UiUpdateItemList();
		UiUpdateInventoryDescription();
	}

}










	// Legacy GUI setup:
/*	function OnGUI () {
		if (opened == true) {
			if (interfaceStyle.interfaceSkin != null) {
				GUI.skin = interfaceStyle.interfaceSkin;
			}

			//menuSpaceOrigin = Vector2(Screen.width*.5, Screen.height*.5);
			menuSpaceOrigin = interfaceMenu.menuSpaceOrigin;

			// Show all the useless stuff we're carrying around with us:
			var invOrigin = menuSpaceOrigin + Vector2(-250.0, -202.0);
			GUI.BeginGroup(Rect(invOrigin.x, invOrigin.y, 500.0, 396.0));

			// Title box:
			GUI.Label(Rect(0.0, 0.0, 250.0, 32.0), interfaceStyle.inventoryGraphics.titleBox);
			GUI.Label(Rect(38.0, 4.0, 234.0, 25.0), "<b>Item Storage:</b>");

			// Group including all items in the inventory:
			// (Items will be listed in a vertical row, the player can then scroll right through.)
			// (A limited selection can only be visible at a time if the item count exceeds 6 elements.)
			GUI.BeginGroup(Rect(0.0, 32.0, 250.0, 364.0));
			// List of items in the inventory, if there are any:
			if (usedSlotCount > 0) {
				var us : int = 0;	// Position index, depends from used slots.
				for (var i : int; i<slotCount; i++) {
					if (slots[i] != null) {
						// Draw us a beautiful and truly unique background texture:
						var itemTxtPos = 2.0 + us * 52.0 + scrollPos;
						var itemBox = interfaceStyle.inventoryGraphics.itemPassive;
						if (itemTxtPos > 78.0 && itemTxtPos <= 130.0) {
							if (i == selected) {
								itemBox = interfaceStyle.inventoryGraphics.itemFocus;
							}
							else {
								itemBox = interfaceStyle.inventoryGraphics.itemHover;
							}
						}
						else {
							if (i == selected) {
								itemBox = interfaceStyle.inventoryGraphics.itemSelect;
							}
						}
						GUI.Label(Rect(0.0, itemTxtPos-2.0, 250.0, 52.0), itemBox);
						// Show us a nice icon in format 4:3 of the item at hand:
						if (slots[i].itemIcon != null) {
							GUI.Label(Rect(30.0, itemTxtPos+8, 42.67, 32.0), slots[i].itemIcon);
						}
						// Show the name and description of the item:
						var itemListTxt = "<b>" + slots[i].entityName + "</b>\n" + slots[i].entityDescript;
						if (GUI.Button(Rect(40.0, itemTxtPos, 205.0, 48.0), "")) {//itemListTxt)) {
							selected = i;
							scroll = (2 - us) * 52.0;
						}
						// Put some text on top of that button: (Includes description)
						GUI.Label(Rect(73.0, itemTxtPos+3.0, 169.0, 48.0), itemListTxt);
						// Increase position index:
						us++;
					}
				}
			}
			// If there are no items in storage:
			else {
				// Just put a box that says so:
				GUI.Box(Rect(0.0, 0.0, 250.0, 25.0), "<i>No items in possession.</i>");
			}
			// End the vertical item list's group:
			GUI.EndGroup();

			// If an item was selected, show more info about it:
			if (selected > -1 && slots[selected] != null) {
				// Begin a new group for this tab:	(There will be several objects in here!)
				GUI.BeginGroup(Rect(252.0, 32.0, 250.0, 250.0));
				// First of all, draw a pretty little window in the background:
				GUI.Label(Rect(0.0, 0.0, 250.0, 250.0), interfaceStyle.inventoryGraphics.itemInfoTab);
				// Get the item we're showcasing in detail:
				var select = slots[selected];
				// Place a nice little icon in the upper left corner:
				if (select.itemIcon != null) {
					GUI.Label(Rect(31.0, 6.0, 64.0, 48.0), select.itemIcon);	// Icons should be in 4:3.
				}
				// Put a title and description to the right of the icon:
				GUI.Label(Rect(100.0, 4.0, 178.0, 25.0), "<b>" + select.entityName + ":</b>");
				GUI.Label(Rect(100.0, 35.0, 178.0, 160.0), select.entityDescript);
				// List some options concerning interaction below:
				// X X X
				// X X X
				// X X X
				// End selection info tab's group:
				GUI.EndGroup();
			}

			GUI.EndGroup();
		}
	}	*/


























