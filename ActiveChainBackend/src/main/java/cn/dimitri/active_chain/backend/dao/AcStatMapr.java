package cn.dimitri.active_chain.backend.dao;

import cn.dimitri.active_chain.backend.po.AcStat;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface AcStatMapr {
    @Results(
            id = "AC_STAT", value = {
            @Result(property = "wxUid", column = "wx_uid"),
            @Result(property = "mMarking", column = "m_marking"),
            @Result(property = "mRank", column = "m_rank")
    }
    )
    @Select("SELECT * FROM AC_STAT WHERE wx_uid = #{uid}")
    AcStat selectOne(String uid);

    @ResultMap("AC_STAT")
    @Select("SELECT * FROM AC_STAT ORDER BY m_marking DESC LIMIT 100")
    List<AcStat> selectTop100();

    @Insert("INSERT INTO AC_STAT VALUES(#{wxUid}, #{mMarking}, #{mRank})")
    int insertStat(AcStat acStat);

    @Update("UPDATE AC_STAT SET m_marking = #{mMarking}, " +
            " m_rank = #{mRank}, " +
            " WHERE wx_uid = #{wxUid}")
    int updateStat(AcStat acStat);

    @Delete("DELETE FROM AC_STAT")
    int clearStat();

    @Select("SELECT count(*) AS res FROM AC_STAT WHERE m_marking > #{marking}")
    int getMarkingRank(double marking);
}
