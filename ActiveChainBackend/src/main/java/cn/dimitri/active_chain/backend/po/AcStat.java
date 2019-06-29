package cn.dimitri.active_chain.backend.po;

public class AcStat {

    private String wxUid;
    private double mMarking;
    private int mRank;
    private double mMarkingLast;
    private int mRankLast;

    public String getWxUid() {
        return wxUid;
    }

    public void setWxUid(String wxUid) {
        this.wxUid = wxUid;
    }

    public double getmMarking() {
        return mMarking;
    }

    public void setmMarking(double mMarking) {
        this.mMarking = mMarking;
    }

    public int getmRank() {
        return mRank;
    }

    public void setmRank(int mRank) {
        this.mRank = mRank;
    }

    public double getmMarkingLast() {
        return mMarkingLast;
    }

    public void setmMarkingLast(double mMarkingLast) {
        this.mMarkingLast = mMarkingLast;
    }

    public int getmRankLast() {
        return mRankLast;
    }

    public void setmRankLast(int mRankLast) {
        this.mRankLast = mRankLast;
    }

    public boolean equals(AcStat obj) {
        return this.getWxUid().equals(obj.getWxUid());
    }

    public AcStat() {
        this.mMarking = 0;
        this.mMarkingLast = 0;
        this.mRank = 99999;
        this.mRankLast = 99999;
    }
}
