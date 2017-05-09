#pragma strict

public class PlayerStatsControl extends CharacterStats {
	var opened : boolean = false;

	var combatCtrl : CombatControl;		// Serves as a general player interaction reference.
	var interfaceMenu : InterfaceMenu;
	var inventoryMenu : InventoryControl;

	var statsCanvas : Canvas;
	var statsSlot : UI.Button[] = new UI.Button[6];
	var statsSlotTxt : UI.Text[] = new UI.Text[6];
	var statsSlotIcon : UI.Image[] = new UI.Image[6];

	private var blankItemIcon : Sprite;
	private var missingItemIcon : Sprite;
	var activeSlotBox : Sprite;
	var inactiveSlotBox : Sprite;
	
	function Start () {
		blankItemIcon = interfaceMenu.blankItemIcon;
		missingItemIcon = interfaceMenu.missingItemIcon;	
	}

	function UiTogglePlayerStats (openNow : boolean) {
		if (openNow == true) {
			// Make sure all buffs were applied correctly:
			UpdateCharacterBuffs();
			// Then update the UI:
			UiUpdateEquipList();
		}
		// Enable or disable the UI canvas:
		statsCanvas.enabled = openNow;
		opened = openNow;
	}

	// Update the UI list of items acting upon this character:
	function UiUpdateEquipList () {
		for (var i : int; i<6; i++) {
			
		}
	}

}





























