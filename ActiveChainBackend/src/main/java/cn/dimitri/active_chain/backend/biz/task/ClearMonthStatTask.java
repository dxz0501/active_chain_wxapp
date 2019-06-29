package cn.dimitri.active_chain.backend.biz.task;

import cn.dimitri.active_chain.backend.dao.AcStatMapr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ClearMonthStatTask {

    private final AcStatMapr statDao;

    @Autowired
    public ClearMonthStatTask(AcStatMapr statDao) {
        this.statDao = statDao;
    }

    @Scheduled(cron = "0 0 0 1 * * ") // 每月一次定时任务
    public void clearStat(){
        statDao.clearStat();
    }
}
