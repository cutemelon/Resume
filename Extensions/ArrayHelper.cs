using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace Extensions
{
    public static class ArrayHelper
    {
        public static string GetString(this IEnumerable<int> array, char splitChar = ',', string defaultValue = "0")
        {
            if (array == null) return defaultValue;
            string result = array.Aggregate(string.Empty,
                                            (current, i) =>
                                            current + i.ToString(CultureInfo.InvariantCulture) +
                                            splitChar.ToString(CultureInfo.InvariantCulture));
            if (result.EndsWith(splitChar.ToString(CultureInfo.InvariantCulture)))
                result = result.TrimEnd(splitChar);
            return string.IsNullOrEmpty(result) ? defaultValue : result;
        }

        public static int[] GetArray(this string ids, char splitChar = ',')
        {
           
            List<int> result = new List<int>();
            if (string.IsNullOrEmpty(ids)) return new int[0];
            string[] idArray = ids.Split(splitChar);
            int tmp = 0;
            for (int i = 0; i < idArray.Length; i++)
            {
                if (int.TryParse(idArray[i], out tmp))
                    result.Add(tmp);
                else
                    return new int[0];
            }
            return result.ToArray();
        }

        public static void ForEach<T>(this IEnumerable<T> array , Action<T,int> action)
        {
            if (array == null) return;
            if (action == null) return;
            int index = 0;
            foreach (var t in array)
            {
                action(t,index);
                index++;
            }
        }
    }
}