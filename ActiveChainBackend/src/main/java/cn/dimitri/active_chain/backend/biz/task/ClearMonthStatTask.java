package cn.dimitri.active_chain.backend.biz.task;

import cn.dimitri.active_chain.backend.dao.AcStatMapr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Configuration      //1.主要用于标记配置类，兼备Component的效果。
@EnableScheduling   // 2.开启定时任务
public class ClearMonthStatTask {

    private final AcStatMapr statDao;

    @Autowired
    public ClearMonthStatTask(AcStatMapr statDao) {
        this.statDao = statDao;
    }

    @Scheduled(cron = "0 59 23 L * ? ") // 每月一次定时任务
    public void clearStat(){
        statDao.clearStat();
    }
}
