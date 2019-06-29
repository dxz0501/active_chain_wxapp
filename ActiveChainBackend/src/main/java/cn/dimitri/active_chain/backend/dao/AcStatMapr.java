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
            @Result(property = "mRank", column = "m_rank"),
            @Result(property = "mMarkingLast", column = "m_marking_last"),
            @Result(property = "mRankLast", column = "m_rank_last")
    }
    )
    @Select("SELECT * FROM AC_STAT WHERE wx_uid = #{uid}")
    AcStat selectOne(@Param("uid") String uid);

    @ResultMap("AC_STAT")
    @Select("SELECT * FROM AC_STAT ORDER BY m_marking DESC LIMIT 100")
    List<AcStat> selectTop100();

    @ResultMap("AC_STAT")
    @Select("SELECT * FROM AC_STAT ORDER BY m_marking_last DESC LIMIT 100")
    List<AcStat> selectTop100Last();

    @Insert("INSERT INTO AC_STAT VALUES(#{wxUid}, #{mMarking}, #{mRank}, #{mMarkingLast}, #{mRankLast})")
    int insertStat(AcStat acStat);

    @Update("UPDATE AC_STAT SET m_marking = #{mMarking}, " +
            " m_rank = #{mRank}, " +
            " m_marking_last = #{mMarkingLast}, " +
            " m_rank_last = #{mRankLast} " +
            " WHERE wx_uid = #{wxUid}")
    int updateStat(AcStat acStat);

    @Delete("DELETE FROM AC_STAT")
    int clearStat();

    @Select("SELECT count(*) AS res FROM AC_STAT WHERE m_marking > #{marking}")
    int getMarkingRank(@Param("marking") double marking);

    @Select("SELECT count(*) AS res FROM AC_STAT WHERE m_marking_last > #{marking}")
    int getMarkingRankLast(@Param("marking") double marking);
}
