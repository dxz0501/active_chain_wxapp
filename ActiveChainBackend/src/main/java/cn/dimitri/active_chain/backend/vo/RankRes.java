package cn.dimitri.active_chain.backend.vo;

public class RankRes {
    private int rank;
    private double marking;
    private int rankLast;
    private double markingLast;

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    public double getMarking() {
        return marking;
    }

    public void setMarking(double marking) {
        this.marking = marking;
    }

    public int getRankLast() {
        return rankLast;
    }

    public void setRankLast(int rankLast) {
        this.rankLast = rankLast;
    }

    public double getMarkingLast() {
        return markingLast;
    }

    public void setMarkingLast(double markingLast) {
        this.markingLast = markingLast;
    }
}
