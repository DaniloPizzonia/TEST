using UnityEngine;
using System.Collections;

namespace MKToon
{
    public class MKToonUISliderValue : MonoBehaviour
    {
        public UnityEngine.UI.Slider slider;
        public UnityEngine.UI.Text text;

        public float minValue;
        public float maxValue;

        void Update()
        {
            text.text = System.Math.Round(slider.value, 2).ToString();
        }

        public void ResetDefaultValue(float defaultValue)
        {
            slider.minValue = minValue;
            slider.maxValue = maxValue;
            slider.value = defaultValue;
        }
    }
}