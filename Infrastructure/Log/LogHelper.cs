using System;
using System.IO;
using log4net;

namespace Infrastructure.Log
{
    public class LogHelper
    {
        private static readonly ILog loginfo = LogManager.GetLogger("loginfo");
        private static readonly ILog logerror = LogManager.GetLogger("logerror");
        private static readonly ILog logmonitor = LogManager.GetLogger("logmonitor");

        public static void Error(string ErrorMsg, Exception ex = null)
        {
            if (ex != null)
            {
                logerror.Error(ErrorMsg, ex);
            }
            else
            {
                logerror.Error(ErrorMsg);
            }
        }

        public static void Info(string Msg)
        {
            loginfo.Info(Msg);
        }

        public static void Monitor(string Msg)
        {
            logmonitor.Info(Msg);
        }
    }
}