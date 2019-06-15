package cn.dimitri.active_chain.backend.biz.task;

import cn.dimitri.active_chain.backend.biz.AcInfoService;
import cn.dimitri.active_chain.backend.dao.AcStatMapr;
import cn.dimitri.active_chain.backend.dao.WxUserMapr;
import cn.dimitri.active_chain.backend.po.AcStat;
import cn.dimitri.active_chain.backend.po.WxUser;
import cn.dimitri.active_chain.backend.util.DateUtils;
import cn.dimitri.active_chain.backend.vo.AcInfoRes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

//@Component
//@Configuration      //1.主要用于标记配置类，兼备Component的效果。
//@EnableScheduling   // 2.开启定时任务
public class UpdateUserMonthStatTask {

    private final WxUserMapr userDao;
    private final AcStatMapr statDao;
    private final AcInfoService infoService;

    @Autowired
    public UpdateUserMonthStatTask(WxUserMapr userDao, AcStatMapr statDao, AcInfoService infoService) {
        this.userDao = userDao;
        this.statDao = statDao;
        this.infoService = infoService;
    }

//    @Scheduled(cron = "0 0 0/1 * * ? ") // 每小时一次定时任务
    public void updateUserMonthTotalMarking(){
        List<WxUser> userLst = userDao.selectAll();
        for(int n=0; n<userLst.size(); n++) {
            WxUser user = userLst.get(n);
            if(user == null) continue;
            String uid = user.getWxUid();

            double totalMarking = 0;

            String tDate = DateUtils.date2String(new Date());
            String sDate = tDate.substring(0, 6) + "01";

            List<AcInfoRes> infoResLst = this.infoService.getInfoRecords(uid, sDate, tDate);
            for (int i = 0; i < infoResLst.size(); i++) {
                AcInfoRes infoRes = infoResLst.get(i);
                if (infoRes == null) continue;
                totalMarking += infoRes.getMarking();
            }

            if (totalMarking == 0) return;
            AcStat acStat = statDao.selectOne(uid);
            if (acStat == null) {
                acStat = new AcStat();
                acStat.setWxUid(uid);
                acStat.setmMarking(totalMarking);
                acStat.setmRank(statDao.getMarkingRank(totalMarking));
                statDao.insertStat(acStat);
            } else {
                acStat.setmMarking(totalMarking);
                statDao.updateStat(acStat);
            }
        }
    }
}
