using UnityEngine;
using System.Collections;
using System.Collections.Generic;


namespace MKToon
{
    namespace MKTonn
    {
        public class MKToonDemoController : MonoBehaviour
        {
            public enum LightMode
            {
                DEFAULT,
                TOON_TRESHOLD,
                TOON_LEVELS
            }

            public GameObject[] menuObjects;
            public GameObject[] lightModeUIs;

            public UnityEngine.UI.Text lightModeText;

            private LightMode lightMode;
            public ColorPicker[] colorPickers;

            public MKToonUISliderValue[] sliderValues;
            private int currentObject;

            [System.Serializable]
            public class DemoObject
            {
                public DemoObjectLightingVariant defaultL;
                public DemoObjectLightingVariant thresholdL;
                public DemoObjectLightingVariant levelsL;
            }

            [System.Serializable]
            public class DemoObjectLightingVariant
            {
                public GameObject go;
                public Material[] materials;
            }

            [System.Serializable]
            public class DemoObjectCollection
            {
                public GameObject parentObject;
                public DemoObject[] demoObjects;
            }

            public DemoObjectCollection[] demoObjectCollection;

            public DemoObjectCollection[] backgroundCollection;

            private List<Renderer> activeRenderers = new List<Renderer>();
            private List<Renderer> backgroundRenderers = new List<Renderer>();

            private void Start()
            {
                for (int i = 0; i < demoObjectCollection.Length; i++)
                {
                    demoObjectCollection[i].parentObject.SetActive(false);
                }
                demoObjectCollection[currentObject].parentObject.SetActive(true);
                CreateActiveMaterials(currentObject);
                SetDefaultV();
                ChangeLightmode(LightMode.TOON_TRESHOLD);
            }

            private void CreateActiveMaterials(int i)
            {
                activeRenderers.Clear();
                backgroundRenderers.Clear();
                for (int o = 0; o < demoObjectCollection[i].demoObjects.Length; o++)
                {
                    for (int m = 0; m < demoObjectCollection[i].demoObjects[o].defaultL.materials.Length; m++)
                    {
                        activeRenderers.Add(demoObjectCollection[i].demoObjects[o].defaultL.go.GetComponent<Renderer>());
                        activeRenderers[activeRenderers.Count-1].materials[m] = new Material(demoObjectCollection[i].demoObjects[o].defaultL.materials[m]);
                    }
                    for (int m = 0; m < demoObjectCollection[i].demoObjects[o].thresholdL.materials.Length; m++)
                    {
                        activeRenderers.Add(demoObjectCollection[i].demoObjects[o].thresholdL.go.GetComponent<Renderer>());
                        activeRenderers[activeRenderers.Count - 1].materials[m] = new Material(demoObjectCollection[i].demoObjects[o].thresholdL.materials[m]);
                    }
                    for (int m = 0; m < demoObjectCollection[i].demoObjects[o].levelsL.materials.Length; m++)
                    {
                        activeRenderers.Add(demoObjectCollection[i].demoObjects[o].levelsL.go.GetComponent<Renderer>());
                        activeRenderers[activeRenderers.Count - 1].materials[m] = new Material(demoObjectCollection[i].demoObjects[o].levelsL.materials[m]);
                    }
                }

                for (int o = 0; o < backgroundCollection[0].demoObjects.Length; o++)
                {
                    for (int m = 0; m < backgroundCollection[0].demoObjects[o].defaultL.materials.Length; m++)
                    {
                        backgroundRenderers.Add(backgroundCollection[0].demoObjects[o].defaultL.go.GetComponent<Renderer>());
                        backgroundRenderers[backgroundRenderers.Count - 1].materials[m] = new Material(backgroundCollection[0].demoObjects[o].defaultL.materials[m]);
                    }
                    for (int m = 0; m < backgroundCollection[0].demoObjects[o].thresholdL.materials.Length; m++)
                    {
                        backgroundRenderers.Add(backgroundCollection[0].demoObjects[o].thresholdL.go.GetComponent<Renderer>());
                        backgroundRenderers[backgroundRenderers.Count - 1].materials[m] = new Material(backgroundCollection[0].demoObjects[o].thresholdL.materials[m]);
                    }
                    for (int m = 0; m < backgroundCollection[0].demoObjects[o].levelsL.materials.Length; m++)
                    {
                        backgroundRenderers.Add(backgroundCollection[0].demoObjects[o].levelsL.go.GetComponent<Renderer>());
                        backgroundRenderers[backgroundRenderers.Count - 1].materials[m] = new Material(backgroundCollection[0].demoObjects[o].levelsL.materials[m]);
                    }
                }
            }
            
            #region get/set
            private float brightness;
            public float Brightness
            {
                get
                {
                    return brightness;
                }
                set
                {
                    brightness = value;
                    for (int i = 0; i < activeRenderers.Count; i++)
                    {
                        for (int m = 0; m < activeRenderers[i].materials.Length; m++)
                        {
                            activeRenderers[i].materials[m].SetFloat("_Brightness", brightness);
                        }
                    }
                }
            }
            private float lightLevelsDiffuse;
            public float LightLevelsDiffuse
            {
                get
                {
                    return lightLevelsDiffuse;
                }
                set
                {
                    lightLevelsDiffuse = value;
                    for (int i = 0; i < activeRenderers.Count; i++)
                    {
                        for (int m = 0; m < activeRenderers[i].materials.Length; m++)
                        {
                            activeRenderers[i].materials[m].SetFloat("_LightLevelsDiffuse", lightLevelsDiffuse);
                        }
                    }

                    for (int i = 0; i < backgroundRenderers.Count; i++)
                    {
                        for (int m = 0; m < backgroundRenderers[i].materials.Length; m++)
                        {
                            backgroundRenderers[i].materials[m].SetFloat("_LightLevelsDiffuse", lightLevelsDiffuse);
                        }
                    }
                }
            }
            private float lightLevelsSpecular;
            public float LightLevelsSpecular
            {
                get
                {
                    return lightLevelsSpecular;
                }
                set
                {
                    lightLevelsSpecular = value;
                    for (int i = 0; i < activeRenderers.Count; i++)
                    {
                        for (int m = 0; m < activeRenderers[i].materials.Length; m++)
                        {
                            activeRenderers[i].materials[m].SetFloat("_LightLevelsSpecular", lightLevelsSpecular);
                        }
                    }
                }
            }
            private float lLThreshold;
            public float LThreshold
            {
                get
                {
                    return lLThreshold;
                }
                set
                {
                    lLThreshold = value;
                    for(int i = 0; i < activeRenderers.Count; i++)
                    {
                        for (int m = 0; m < activeRenderers[i].materials.Length; m++)
                        {
                            activeRenderers[i].materials[m].SetFloat("_LThreshold", lLThreshold);
                        }
                    }

                    for (int i = 0; i < backgroundRenderers.Count; i++)
                    {
                        for (int m = 0; m < backgroundRenderers[i].materials.Length; m++)
                        {
                            backgroundRenderers[i].materials[m].SetFloat("_LThreshold", lLThreshold);
                        }
                    }
                }
            }
            private float shininess;
            public float Shininess
            {
                get
                {
                    return shininess;
                }
                set
                {
                    shininess = value;
                    for (int i = 0; i < activeRenderers.Count; i++)
                    {
                        for (int m = 0; m < activeRenderers[i].materials.Length; m++)
                        {
                            activeRenderers[i].materials[m].SetFloat("_Shininess", shininess);
                        }
                    }
                }
            }
            private float toonyFy;
            public float ToonyFy
            {
                get
                {
                    return toonyFy;
                }
                set
                {
                    toonyFy = value;
                    for (int i = 0; i < activeRenderers.Count; i++)
                    {
                        for (int m = 0; m < activeRenderers[i].materials.Length; m++)
                        {
                            activeRenderers[i].materials[m].SetFloat("_ToonyFy", toonyFy);
                        }
                    }

                    for (int i = 0; i < backgroundRenderers.Count; i++)
                    {
                        for (int m = 0; m < backgroundRenderers[i].materials.Length; m++)
                        {
                            backgroundRenderers[i].materials[m].SetFloat("_ToonyFy", toonyFy);
                        }
                    }
                }
            }
            private float rimSize;
            public float RimSize
            {
                get
                {
                    return rimSize;
                }
                set
                {
                    rimSize = value;
                    for (int i = 0; i < activeRenderers.Count; i++)
                    {
                        for (int m = 0; m < activeRenderers[i].materials.Length; m++)
                        {
                            activeRenderers[i].materials[m].SetFloat("_RimSize", rimSize);
                        }
                    }
                }
            }
            private float smoothness;
            public float Smoothness
            {
                get
                {
                    return smoothness;
                }
                set
                {
                    smoothness = value;
                    for (int i = 0; i < activeRenderers.Count; i++)
                    {
                        for (int m = 0; m < activeRenderers[i].materials.Length; m++)
                        {
                            activeRenderers[i].materials[m].SetFloat("_Smoothness", smoothness);
                        }
                    }

                    for (int i = 0; i < backgroundRenderers.Count; i++)
                    {
                        for (int m = 0; m < backgroundRenderers[i].materials.Length; m++)
                        {
                            backgroundRenderers[i].materials[m].SetFloat("_Smoothness", smoothness);
                        }
                    }
                }
            }
            private float outlineSize;
            public float OutlineSize
            {
                get
                {
                    return outlineSize;
                }
                set
                {
                    outlineSize = value;
                    for (int i = 0; i < activeRenderers.Count; i++)
                    {
                        for (int m = 0; m < activeRenderers[i].materials.Length; m++)
                        {
                            activeRenderers[i].materials[m].SetFloat("_OutlineSize", outlineSize);
                        }
                    }
                }
            }

            private Color mainColor;
            public Color MainColor
            {
                get
                {
                    return mainColor;
                }
                set
                {
                    mainColor = value;
                    for (int i = 0; i < activeRenderers.Count; i++)
                    {
                        for (int m = 0; m < activeRenderers[i].materials.Length; m++)
                        {
                            activeRenderers[i].materials[m].SetColor("_Color", mainColor);
                        }
                    }
                }
            }
            private Color specularColor;
            public Color SpecularColor
            {
                get
                {
                    return specularColor;
                }
                set
                {
                    specularColor = value;
                    for (int i = 0; i < activeRenderers.Count; i++)
                    {
                        for (int m = 0; m < activeRenderers[i].materials.Length; m++)
                        {
                            activeRenderers[i].materials[m].SetColor("_SpecularColor", specularColor);
                        }
                    }
                }
            }
            private Color rimColor;
            public Color RimColor
            {
                get
                {
                    return rimColor;
                }
                set
                {
                    rimColor = value;
                    for (int i = 0; i < activeRenderers.Count; i++)
                    {
                        for (int m = 0; m < activeRenderers[i].materials.Length; m++)
                        {
                            activeRenderers[i].materials[m].SetColor("_RimColor", rimColor);
                        }
                    }
                }
            }
            private Color outlineColor;
            public Color OutlineColor
            {
                get
                {
                    return outlineColor;
                }
                set
                {
                    outlineColor = value;
                    for (int i = 0; i < activeRenderers.Count; i++)
                    {
                        for (int m = 0; m < activeRenderers[i].materials.Length; m++)
                        {
                            activeRenderers[i].materials[m].SetColor("_OutlineColor", outlineColor);
                        }
                    }
                }
            }
            #endregion

            private void SetDefaultV()
            {
                sliderValues[0].ResetDefaultValue(demoObjectCollection[currentObject].demoObjects[0].defaultL.materials[0].GetFloat("_Brightness"));
                sliderValues[1].ResetDefaultValue(demoObjectCollection[currentObject].demoObjects[0].defaultL.materials[0].GetFloat("_Bumpiness"));
                sliderValues[2].ResetDefaultValue(demoObjectCollection[currentObject].demoObjects[0].levelsL.materials[0].GetFloat("_LightLevelsDiffuse"));
                sliderValues[3].ResetDefaultValue(demoObjectCollection[currentObject].demoObjects[0].levelsL.materials[0].GetFloat("_LightLevelsSpecular"));
                sliderValues[4].ResetDefaultValue(demoObjectCollection[currentObject].demoObjects[0].thresholdL.materials[0].GetFloat("_LThreshold"));
                sliderValues[5].ResetDefaultValue(demoObjectCollection[currentObject].demoObjects[0].defaultL.materials[0].GetFloat("_Shininess"));
                sliderValues[6].ResetDefaultValue(demoObjectCollection[currentObject].demoObjects[0].defaultL.materials[0].GetFloat("_ToonyFy"));
                sliderValues[7].ResetDefaultValue(demoObjectCollection[currentObject].demoObjects[0].thresholdL.materials[0].GetFloat("_Smoothness"));
                sliderValues[8].ResetDefaultValue(demoObjectCollection[currentObject].demoObjects[0].defaultL.materials[0].GetFloat("_RimSize"));
                sliderValues[9].ResetDefaultValue(demoObjectCollection[currentObject].demoObjects[0].defaultL.materials[0].GetFloat("_OutlineSize"));

                mainColor = demoObjectCollection[currentObject].demoObjects[0].defaultL.materials[0].GetColor("_Color");
                specularColor = demoObjectCollection[currentObject].demoObjects[0].defaultL.materials[0].GetColor("_SpecularColor");
                rimColor = demoObjectCollection[currentObject].demoObjects[0].defaultL.materials[0].GetColor("_RimColor");
                outlineColor = demoObjectCollection[currentObject].demoObjects[0].defaultL.materials[0].GetColor("_OutlineColor");

                colorPickers[0].CurrentColor = mainColor;
                colorPickers[1].CurrentColor = specularColor;
                colorPickers[2].CurrentColor = rimColor;
                colorPickers[3].CurrentColor = outlineColor;

                DisableLightModeUI();
                ChangeLightmode(lightMode);
            }

            void Update()
            {
                if(Input.GetKeyDown(KeyCode.Space))
                {
                    menuObjects[0].SetActive(!menuObjects[0].gameObject.activeSelf);
                    menuObjects[1].SetActive(false);
                }
            }

            public void SwitchObject()
            {
                currentObject++;
                if (currentObject > demoObjectCollection.Length - 1)
                    currentObject = 0;

                for(int i = 0; i < demoObjectCollection.Length; i++)
                {
                    demoObjectCollection[i].parentObject.SetActive(false);
                }
                sliderValues[1].gameObject.SetActive(false);
                CreateActiveMaterials(currentObject);
                SetDefaultV();
                demoObjectCollection[currentObject].parentObject.SetActive(true);
            }

            private void DisableLightModeUI()
            {
                lightModeUIs[0].SetActive(false);
                lightModeUIs[1].SetActive(false);
                lightModeUIs[2].SetActive(false);
                lightModeUIs[3].SetActive(false);
            }

            private void ChangeLightmode(LightMode mode)
            {
                DisableLightModeUI();
                for (int i = 0; i < demoObjectCollection[currentObject].demoObjects.Length; i++)
                {
                    demoObjectCollection[currentObject].demoObjects[i].defaultL.go.SetActive(false);
                    demoObjectCollection[currentObject].demoObjects[i].thresholdL.go.SetActive(false);
                    demoObjectCollection[currentObject].demoObjects[i].levelsL.go.SetActive(false);
                }

                for (int i = 0; i < backgroundCollection[0].demoObjects.Length; i++)
                {
                    backgroundCollection[0].demoObjects[i].defaultL.go.SetActive(false);
                    backgroundCollection[0].demoObjects[i].thresholdL.go.SetActive(false);
                    backgroundCollection[0].demoObjects[i].levelsL.go.SetActive(false);
                }

                switch (mode)
                {
                    case LightMode.TOON_TRESHOLD:
                        lightMode = LightMode.TOON_TRESHOLD;
                        lightModeText.text = "LightMode: Treshold";
                        lightModeUIs[2].SetActive(true);
                        lightModeUIs[3].SetActive(true);
                        for (int i = 0; i < demoObjectCollection[currentObject].demoObjects.Length; i++)
                        {
                            demoObjectCollection[currentObject].demoObjects[i].thresholdL.go.SetActive(true);
                        }
                        for (int i = 0; i < backgroundCollection[0].demoObjects.Length; i++)
                        {
                            backgroundCollection[0].demoObjects[i].thresholdL.go.SetActive(true);
                        }
                        break;
                    case LightMode.TOON_LEVELS:
                        lightMode = LightMode.TOON_LEVELS;
                        lightModeText.text = "LightMode: Levels";
                        lightModeUIs[0].SetActive(true);
                        lightModeUIs[1].SetActive(true);
                        lightModeUIs[3].SetActive(true);
                        for (int i = 0; i < demoObjectCollection[currentObject].demoObjects.Length; i++)
                        {
                            demoObjectCollection[currentObject].demoObjects[i].levelsL.go.SetActive(true);
                        }
                        for (int i = 0; i < backgroundCollection[0].demoObjects.Length; i++)
                        {
                            backgroundCollection[0].demoObjects[i].levelsL.go.SetActive(true);
                        }
                        break;
                    case LightMode.DEFAULT:
                        lightMode = LightMode.DEFAULT;
                        lightModeText.text = "LightMode: Default";
                        for (int i = 0; i < demoObjectCollection[currentObject].demoObjects.Length; i++)
                        {
                            demoObjectCollection[currentObject].demoObjects[i].defaultL.go.SetActive(true);
                        }
                        for (int i = 0; i < backgroundCollection[0].demoObjects.Length; i++)
                        {
                            backgroundCollection[0].demoObjects[i].defaultL.go.SetActive(true);
                        }
                        break;
                }
            }

            public void ChangeLightmode()
            {
                DisableLightModeUI();
                for (int i = 0; i < demoObjectCollection[currentObject].demoObjects.Length; i++)
                {
                    demoObjectCollection[currentObject].demoObjects[i].defaultL.go.SetActive(false);
                    demoObjectCollection[currentObject].demoObjects[i].thresholdL.go.SetActive(false);
                    demoObjectCollection[currentObject].demoObjects[i].levelsL.go.SetActive(false);
                }
                for (int i = 0; i < backgroundCollection[0].demoObjects.Length; i++)
                {
                    backgroundCollection[0].demoObjects[i].defaultL.go.SetActive(false);
                    backgroundCollection[0].demoObjects[i].thresholdL.go.SetActive(false);
                    backgroundCollection[0].demoObjects[i].levelsL.go.SetActive(false);
                }
                switch (lightMode)
                {
                    case LightMode.DEFAULT:
                        lightMode = LightMode.TOON_TRESHOLD;
                        lightModeText.text = "LightMode: Treshold";
                        lightModeUIs[2].SetActive(true);
                        lightModeUIs[3].SetActive(true);
                        for(int i = 0; i < demoObjectCollection[currentObject].demoObjects.Length; i++)
                        {
                            demoObjectCollection[currentObject].demoObjects[i].thresholdL.go.SetActive(true);
                        }
                        for (int i = 0; i < backgroundCollection[0].demoObjects.Length; i++)
                        {
                            backgroundCollection[0].demoObjects[i].thresholdL.go.SetActive(true);
                        }
                        break;
                    case LightMode.TOON_TRESHOLD:
                        lightMode = LightMode.TOON_LEVELS;
                        lightModeText.text = "LightMode: Levels";
                        lightModeUIs[0].SetActive(true);
                        lightModeUIs[1].SetActive(true);
                        lightModeUIs[3].SetActive(true);
                        for (int i = 0; i < demoObjectCollection[currentObject].demoObjects.Length; i++)
                        {
                            demoObjectCollection[currentObject].demoObjects[i].levelsL.go.SetActive(true);
                        }
                        for (int i = 0; i < backgroundCollection[0].demoObjects.Length; i++)
                        {
                            backgroundCollection[0].demoObjects[i].levelsL.go.SetActive(true);
                        }
                        break;
                    case LightMode.TOON_LEVELS:
                        lightMode = LightMode.DEFAULT;
                        lightModeText.text = "LightMode: Default";
                        for (int i = 0; i < demoObjectCollection[currentObject].demoObjects.Length; i++)
                        {
                            demoObjectCollection[currentObject].demoObjects[i].defaultL.go.SetActive(true);
                        }
                        for (int i = 0; i < backgroundCollection[0].demoObjects.Length; i++)
                        {
                            backgroundCollection[0].demoObjects[i].defaultL.go.SetActive(true);
                        }
                        break;
                }
            }
            
        }
    }
}