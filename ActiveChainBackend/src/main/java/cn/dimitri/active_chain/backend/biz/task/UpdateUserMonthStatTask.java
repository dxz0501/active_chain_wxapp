package cn.dimitri.active_chain.backend.biz.task;

import cn.dimitri.active_chain.backend.biz.AcInfoService;
import cn.dimitri.active_chain.backend.dao.AcStatMapr;
import cn.dimitri.active_chain.backend.dao.WxUserMapr;
import cn.dimitri.active_chain.backend.po.AcStat;
import cn.dimitri.active_chain.backend.po.WxUser;
import cn.dimitri.active_chain.backend.util.DateUtils;
import cn.dimitri.active_chain.backend.vo.AcInfoRes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Component
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

    @Scheduled(cron = "0 0,15,30,45 0-23 * * *  ") // 每15min一次定时任务
//    @Scheduled(cron = "0 0,5,10,15,20,25,30,35,40,45,50,55 0-23 * * *  ") // 每五分钟一次定时任务
    public void updateUserMonthTotalMarking(){
        List<WxUser> userLst = userDao.selectAll();
        for(int n=0; n<userLst.size(); n++) {
            WxUser user = userLst.get(n);
            if(user == null) continue;
            String uid = user.getWxUid();

            // this month
            {
                double totalMarking = 0;

                String tDate = DateUtils.date2String(new Date());
                String sDate = tDate.substring(0, 8) + "01";

                List<AcInfoRes> infoResLst = this.infoService.getInfoRecords(uid, sDate, tDate);
                for (int i = 0; i < infoResLst.size(); i++) {
                    AcInfoRes infoRes = infoResLst.get(i);
                    if (infoRes == null) continue;
                    totalMarking += infoRes.getMarking();
                }

                if (totalMarking == 0) continue;
                AcStat acStat = statDao.selectOne(uid);
                if (acStat == null) {
                    acStat = new AcStat();
                    acStat.setWxUid(uid);
                    acStat.setmMarking(totalMarking);
                    acStat.setmRank(statDao.getMarkingRank(totalMarking + 0.001) + 1);
                    statDao.insertStat(acStat);
                } else {
                    acStat.setmMarking(totalMarking);
                    acStat.setmRank(statDao.getMarkingRank(totalMarking + 0.001) + 1);
                    statDao.updateStat(acStat);
                }
            }

            // last month
            {
                double totalMarking = 0;

                Calendar calendar = Calendar.getInstance();
                calendar.setTime(new Date());
                calendar.add(Calendar.MONTH, -1);
                calendar.set(Calendar.DATE, 1);
                Date dateFrom = calendar.getTime();

                calendar.setTime(new Date());
                calendar.set(Calendar.DATE, 1);
                calendar.add(Calendar.DATE, -1);
                Date dateTo = calendar.getTime();

                String tDate = DateUtils.date2String(dateTo);
                String sDate = DateUtils.date2String(dateFrom);

                List<AcInfoRes> infoResLst = this.infoService.getInfoRecords(uid, sDate, tDate);
                for (int i = 0; i < infoResLst.size(); i++) {
                    AcInfoRes infoRes = infoResLst.get(i);
                    if (infoRes == null) continue;
                    totalMarking += infoRes.getMarking();
                }

                if (totalMarking == 0) continue;
                AcStat acStat = statDao.selectOne(uid);
                if (acStat == null) {
                    acStat = new AcStat();
                    acStat.setWxUid(uid);
                    acStat.setmMarkingLast(totalMarking);
                    acStat.setmRankLast(statDao.getMarkingRankLast(totalMarking + 0.001) + 1);
                    statDao.insertStat(acStat);
                } else {
                    acStat.setmMarkingLast(totalMarking);
                    acStat.setmRankLast(statDao.getMarkingRankLast(totalMarking + 0.001) + 1);
                    statDao.updateStat(acStat);
                }
            }
        }
    }
}
