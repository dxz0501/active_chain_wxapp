package cn.dimitri.active_chain.backend.biz;

import cn.dimitri.active_chain.backend.dao.AcCoeffMapr;
import cn.dimitri.active_chain.backend.dao.AcInfoMapr;
import cn.dimitri.active_chain.backend.dao.AcStatMapr;
import cn.dimitri.active_chain.backend.dao.WxUserMapr;
import cn.dimitri.active_chain.backend.po.AcCoeff;
import cn.dimitri.active_chain.backend.po.AcInfo;
import cn.dimitri.active_chain.backend.po.AcStat;
import cn.dimitri.active_chain.backend.po.WxUser;
import cn.dimitri.active_chain.backend.util.DateUtils;
import cn.dimitri.active_chain.backend.vo.AcInfoRes;
import cn.dimitri.active_chain.backend.vo.RankDetail;
import cn.dimitri.active_chain.backend.vo.RankRes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class AcInfoService {
    private final AcInfoMapr infoDao;
    private final AcCoeffMapr coeffDao;
    private final WxUserMapr userDao;
    private final AcStatMapr statDao;

    @Autowired
    public AcInfoService(AcInfoMapr infoDao, AcCoeffMapr coeffDao, WxUserMapr userDao, AcStatMapr statDao) {
        this.infoDao = infoDao;
        this.coeffDao = coeffDao;
        this.userDao = userDao;
        this.statDao = statDao;
    }

    public boolean deleteInfo(long sid){
        boolean success = infoDao.deleteInfo(sid) > 0;
        return success;
    }

    public boolean insertInfo(AcInfo acInfo){
        if(acInfo == null) return false;
        boolean success = infoDao.insertInfo(acInfo) > 0;
        return success;
    }

    public List<AcInfoRes> getInfoRecords(String uid, String sDate, String tDate){
        List<AcInfoRes> res = new ArrayList<AcInfoRes>();
        AcCoeff coeff = coeffDao.selectOne();
        WxUser user = userDao.selectOne(uid);
        if(coeff == null || user == null){
            return res;
        }
        // 开始统计
        List<AcInfo> infoList = infoDao.selectRecords(uid, sDate, tDate);
        for(int i=0; i<infoList.size(); i++){
            AcInfo info = infoList.get(i);
            double marking = 0;
            if(info == null) continue;
            double genderIndex = 0;
            double fatIndex = 0;

            if(user.getuGender() == 0){ // Female
                genderIndex = coeff.getFemaleCoeff();
            }else { // Male
                genderIndex = coeff.getMaleCoeff();
            }

            if(user.getuWeight() > coeff.getFitFat()){
                fatIndex = coeff.getFatCoeff();
            }else{
                fatIndex = coeff.getFitCoeff();
            }

            marking = info.getAcAmount() * genderIndex * fatIndex;

            AcInfoRes infoRes = new AcInfoRes();
            infoRes.setInfo(info);
            infoRes.setMarking(marking);
            res.add(infoRes);
        }
        return res;
    }

    public RankRes getUserMonthStat(String uid){
        RankRes res = new RankRes();
        AcStat stat = statDao.selectOne(uid);
        if(stat == null){
            res.setMarking(0);
            res.setRank(99999);
        }else {
            res.setMarking(stat.getmMarking());
            res.setRank(stat.getmRank());
        }
        return res;
    }

    public List<RankDetail> getUserMonthRankDetail(){
        List<RankDetail> res = new ArrayList<RankDetail>();
        List<AcStat> statLst = statDao.selectTop100();
        for(int i=0; i<statLst.size(); i++){
            AcStat stat = statLst.get(i);
            if(stat == null) continue;
            RankDetail rd = new RankDetail();
            WxUser user = userDao.selectOne(stat.getWxUid());
            RankRes rank = new RankRes();
            rank.setRank(stat.getmRank());
            rank.setMarking(stat.getmMarking());
            rd.setWxUser(user);
            rd.setRankRes(rank);
            res.add(rd);
        }
        return res;
    }
}
