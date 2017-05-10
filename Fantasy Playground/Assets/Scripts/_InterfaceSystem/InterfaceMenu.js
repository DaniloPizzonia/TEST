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

var menuCanvas : GameObject;
var rootCanvas : GameObject;

var blankItemIcon : Sprite;
var missingItemIcon : Sprite;


function Start () {
	menuSpaceOrigin = Vector2(Screen.width*.5, Screen.height*.5);
	rootCanvas.SetActive(opened);
}

function Update () {
	if (opened == true) {
		scrollTar = menuDepth * 86.0;
		scrollPos = Mathf.Lerp(scrollPos, scrollTar, Time.deltaTime * 3.0);
		var screenSpace = Vector2.Scale(Vector2(Screen.width, Screen.height), Vector2(menuPosition.x, menuPosition.y));
		menuSpaceOrigin = screenSpace + Vector2(menuPosition.z, menuPosition.w + scrollPos);
		var UiRect = menuCanvas.GetComponent(RectTransform);
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
		SetMenuState(0);
	}
	if (Input.GetKeyDown("i")) {
		SetMenuState(1);
	}
	if (Input.GetKeyDown("l")) {
		SetMenuState(2);
	}
	if (Input.GetKeyDown("m")) {
		SetMenuState(3);
	}
}


function UiOpenMenu () {
	opened = true;
	rootCanvas.SetActive(true);
}
function UiCloseMenu () {
	opened = false;
	rootCanvas.SetActive(false);

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

function SetMenuState(newState : int)
{
	if(newState < 0 || newState > 5)
	{
		UiCloseMenu();
		return;
	}
	if(newState == menuDepth && opened == true)
	{
		UiCloseMenu();
		return;
	}

	menuDepth = newState;
	UiOpenMenu();

	playerStatsCtrl.UiTogglePlayerStats(newState == 0);
	inventoryCtrl.UiToggleInventory(newState == 1);
}

function UiPressMenuListButton (tarDepth : int) {
	SetMenuState(tarDepth);
}






























