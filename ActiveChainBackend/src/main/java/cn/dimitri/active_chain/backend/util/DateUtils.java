package cn.dimitri.active_chain.backend.util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtils {

    public static String date2String(Date dt){
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String dateString = formatter.format(dt);
        return dateString;
    }
}
