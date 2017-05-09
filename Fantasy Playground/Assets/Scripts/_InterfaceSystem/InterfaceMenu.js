#pragma strict

var opened : boolean = false;

var menuDepth : int = 0;

var interfaceStyle : InterfaceReference;

var menuPosition = Vector4(0.0, 0.0, 0.0, 0.0);	// Coded as multipliers of screen size and pixel offset. (mx, my, ox, oy)
@System.NonSerialized
var menuSpaceOrigin : Vector2;
private var scrollTar = 0.0;
private var scrollPos = 0.0;

var combatCtrl : CombatControl;					// Serves as a general player interaction reference.
var playerStatsCtrl : PlayerStatsControl;		// Gives all data and control over the general player status and rig.
var inventoryCtrl : InventoryControl;			// Gives all data and control over the player inventory.
var interactCtrl : MouseInteraction;

var menuCanvas : Canvas;
var rootCanvas : Canvas;

var blankItemIcon : Sprite;
var missingItemIcon : Sprite;


function Start () {
	menuSpaceOrigin = Vector2(Screen.width*.5, Screen.height*.5);
	if (opened == true) {
		rootCanvas.enabled = true;
	}
	else {
		rootCanvas.enabled = false;
	}
}

function Update () {
	if (opened == true) {
		scrollTar = menuDepth * 86.0;
		scrollPos = Mathf.Lerp(scrollPos, scrollTar, Time.deltaTime * 3.0);
		var screenSpace = Vector2.Scale(Vector2(Screen.width, Screen.height), Vector2(menuPosition.x, menuPosition.y));
		menuSpaceOrigin = screenSpace + Vector2(menuPosition.z, menuPosition.w + scrollPos);
		var UiRect = menuCanvas.gameObject.GetComponent(RectTransform);
		UiRect.anchoredPosition = menuSpaceOrigin;

		if (Input.GetKeyDown("tab")) {
			var tabTarDepth = menuDepth + 1;
			if (tabTarDepth > 5) {
				tabTarDepth = 0;
			}
			UiPressMenuListButton(tabTarDepth);
		}
	}

	if (Input.GetKeyDown("escape")) {
		UiToggleMenu();
	}
	if (Input.GetKeyDown("p")) {
		UiTogglePlayer();
	}
	if (Input.GetKeyDown("i")) {
		UiToggleInventory();
	}
	if (Input.GetKeyDown("l")) {
		UiToggleMessages();
	}
	if (Input.GetKeyDown("m")) {
		UiToggleNavigation();
	}
}


function UiOpenMenu () {
	opened = true;
	rootCanvas.enabled = true;
}
function UiCloseMenu () {
	opened = false;
	rootCanvas.enabled = false;

	// Tell all subsections to close as well:
	playerStatsCtrl.UiTogglePlayerStats(false);
	inventoryCtrl.UiToggleInventory(false);
	// X X X	2
	// X X X	3
	// X X X	4
	// X X X	5
}

function UiToggleMenu () {
	if (opened == true) {
		UiCloseMenu();
		opened = false;
	}
	else {
		// Close any interfering UI elements:
		interactCtrl.UiToggleInteractWindow(false);
		interactCtrl.UiToggleObserveWindow(false);
		// Open the main ingame menu:
		UiOpenMenu();
	}
}


function UiTogglePlayer () {
	if (menuDepth != 0) {
		UiOpenMenu();
		menuDepth = 0;
	}
	else {
		UiToggleMenu();
	}
	inventoryCtrl.UiToggleInventory(false);
	playerStatsCtrl.UiTogglePlayerStats(true);
}
function UiToggleInventory () {
	if (menuDepth != 1) {
		UiOpenMenu();
		menuDepth = 1;
	}
	else {
		UiToggleMenu();
	}
	inventoryCtrl.UiToggleInventory(true);
	playerStatsCtrl.UiTogglePlayerStats(false);
}
function UiToggleFriends () {
	if (menuDepth != 2) {
		UiOpenMenu();
		menuDepth = 2;
	}
	else {
		UiToggleMenu();
	}
	inventoryCtrl.UiToggleInventory(false);
	playerStatsCtrl.UiTogglePlayerStats(false);
}
function UiToggleMessages () {
	if (menuDepth != 3) {
		UiOpenMenu();
		menuDepth = 3;
	}
	else {
		UiToggleMenu();
	}
	inventoryCtrl.UiToggleInventory(false);
	playerStatsCtrl.UiTogglePlayerStats(false);
}
function UiToggleNavigation () {
	if (menuDepth != 4) {
		UiOpenMenu();
		menuDepth = 4;
	}
	else {
		UiToggleMenu();
	}
	inventoryCtrl.UiToggleInventory(false);
	playerStatsCtrl.UiTogglePlayerStats(false);
}
function UiToggleSettings () {
	if (menuDepth != 5) {
		UiOpenMenu();
		menuDepth = 5;
	}
	else {
		UiToggleMenu();
	}
	inventoryCtrl.UiToggleInventory(false);
	playerStatsCtrl.UiTogglePlayerStats(false);
}


function UiPressMenuListButton (tarDepth : int) {
	// Go to player stats:
	if (tarDepth == 0) {
		UiTogglePlayer();
	}
	// Go to item inventory:
	else if (tarDepth == 1) {
		UiToggleInventory();
	}
	// Go to friend and player list:
	else if (tarDepth == 2) {
		UiToggleFriends();
	}
	// Go to private message inbox:
	else if (tarDepth == 3) {
		UiToggleMessages();
	}
	// Go to navigation menu:
	else if (tarDepth == 4) {
		UiToggleNavigation();
	}
	// Go to game settings:
	else {
		UiToggleSettings();
	}
}






























