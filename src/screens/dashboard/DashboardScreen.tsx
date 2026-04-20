import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Card} from '../../components';
import {Colors, FontSize, Spacing, BorderRadius, TAB_BAR_HEIGHT} from '../../constants';
import {useAuthStore, useComplianceStore, useNurtureStore} from '../../store';
import {format} from 'date-fns';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface Props {
  navigation: any;
}

export function DashboardScreen({navigation}: Props) {
  const {user} = useAuthStore();
  const {todayProgress, sessions, getWeeklyProgress} = useComplianceStore();
  const {milestones, articles} = useNurtureStore();

  const weeklyProgress = getWeeklyProgress();
  const totalSessions = sessions.length;
  const latestScore =
    sessions.length > 0 ? sessions[sessions.length - 1].walkScore ?? 0 : 0;
  const compliancePercent = todayProgress.compliancePercent;
  const isPro = user?.subscriptionTier === 'pro';

  // Calculate week number (simplified)
  const weekNum = Math.max(1, Math.ceil(totalSessions / 5));

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: TAB_BAR_HEIGHT}}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoIconText}>P</Text>
            </View>
            <Text style={styles.logoText}>PROTONICS</Text>
          </View>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroOverlay}>
            <Text style={styles.heroWeek}>
              WEEK {weekNum} · NEUROMUSCULAR RETRAINING
            </Text>
            <Text style={styles.heroName}>
              {(user?.firstName ?? 'USER').toUpperCase()}{' '}
              {(user?.lastName ?? '').toUpperCase()}
            </Text>
            <Text style={styles.heroSub}>
              Progress Dashboard · {format(new Date(), 'MMMM yyyy')}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* PRO banner */}
          {!isPro && (
            <TouchableOpacity
              style={styles.proBanner}
              onPress={() => navigation.navigate('Plan')}
              activeOpacity={0.7}>
              <View>
                <Text style={styles.proLabel}>PROTONICS PRO</Text>
                <Text style={styles.proDesc}>
                  Unlock clinician reports{'\n'}and advanced analytics
                </Text>
              </View>
              <View style={styles.upgradeBtn}>
                <Text style={styles.upgradeBtnText}>UPGRADE</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Gait Score */}
          <Card>
            <Text style={styles.sectionLabel}>GAIT SCORE</Text>
            <View style={styles.gaitRow}>
              <View style={styles.gaitLeft}>
                <View style={styles.gaitScoreRow}>
                  <Text style={styles.gaitScore}>
                    {latestScore > 0 ? latestScore.toFixed(0) : '—'}
                  </Text>
                  <Text style={styles.gaitMax}>/100</Text>
                </View>
                {latestScore > 0 && (
                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreBadgeText}>
                      ▲ Latest assessment
                    </Text>
                  </View>
                )}
              </View>
              {/* Compliance circle */}
              <View style={styles.complianceCircle}>
                <View style={styles.complianceInner}>
                  <Text style={styles.complianceValue}>
                    {Math.round(compliancePercent)}%
                  </Text>
                </View>
                <Text style={styles.complianceLabel}>COMPLIANCE</Text>
              </View>
            </View>
          </Card>

          {/* 3 metric cards */}
          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>{totalSessions}</Text>
              <Text style={styles.metricLabel}>SESSIONS</Text>
              <Text style={styles.metricSub}>Total</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>
                {todayProgress.totalSteps}
              </Text>
              <Text style={styles.metricLabel}>STEPS TODAY</Text>
              <Text style={styles.metricSub}>
                Goal: {5 * 60} steps
              </Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={[styles.metricValue, {color: Colors.success}]}>
                {latestScore > 0 ? `${latestScore.toFixed(0)}` : '—'}
              </Text>
              <Text style={styles.metricLabel}>WALK SCORE</Text>
              <Text style={styles.metricSub}>Latest</Text>
            </View>
          </View>

          {/* Movement Trend */}
          <Card>
            <View style={styles.trendHeader}>
              <Text style={styles.sectionLabel}>MOVEMENT TREND</Text>
              <View style={styles.trendPill}>
                <Text style={styles.trendPillText}>7 Days</Text>
              </View>
            </View>
            <View style={styles.trendBars}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                const hasData = i < weeklyProgress.length;
                const height = hasData
                  ? Math.max(8, (weeklyProgress[i]?.compliancePercent ?? 0) * 0.6)
                  : 8;
                return (
                  <View key={i} style={styles.trendBarCol}>
                    <View
                      style={[
                        styles.trendBar,
                        {
                          height,
                          backgroundColor: hasData
                            ? Colors.primary
                            : Colors.cardBorder,
                        },
                      ]}
                    />
                    <Text style={styles.trendDay}>{day}</Text>
                  </View>
                );
              })}
            </View>
          </Card>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionBtnPrimary}
              onPress={() => navigation.navigate('Recording')}
              activeOpacity={0.7}>
              <Text style={styles.actionBtnText}>Start Assessment Walk</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtnOutline}
              onPress={() => navigation.navigate('History')}
              activeOpacity={0.7}>
              <Text style={styles.actionBtnOutlineText}>View History</Text>
            </TouchableOpacity>
          </View>

          {/* Weekly Insight */}
          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>WEEKLY INSIGHT</Text>
            <Text style={styles.insightText}>
              {sessions.length > 0
                ? `Your latest walk score is ${latestScore.toFixed(0)}. Consistent sessions are key to restoring your natural gait pattern. `
                : 'Start your first assessment walk to get personalized movement insights. '}
              <Text style={{fontWeight: '700'}}>Keep it up.</Text>
            </Text>
          </View>

          {/* Milestones */}
          <Text style={styles.sectionTitle}>MILESTONES</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.milestonesScroll}>
            {milestones.map(m => {
              const unlocked = !!m.unlockedAt;
              return (
                <View
                  key={m.id}
                  style={[
                    styles.milestoneCard,
                    unlocked && styles.milestoneUnlocked,
                  ]}>
                  <Text style={styles.milestoneIcon}>
                    {unlocked ? '🔥' : '🔒'}
                  </Text>
                  <Text
                    style={[
                      styles.milestoneName,
                      !unlocked && styles.milestoneLocked,
                    ]}
                    numberOfLines={2}>
                    {m.title.toUpperCase()}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          {/* Education */}
          <Text style={styles.sectionTitle}>EDUCATION</Text>
          {articles.slice(0, 2).map(article => (
            <TouchableOpacity
              key={article.id}
              style={styles.eduCard}
              onPress={() =>
                navigation.getParent()?.navigate('Learn', {
                  screen: 'ArticleDetail',
                  params: {articleId: article.id},
                })
              }
              activeOpacity={0.7}>
              <View style={styles.eduThumb} />
              <View style={styles.eduInfo}>
                <Text style={styles.eduCategory}>
                  {article.category.toUpperCase()}
                </Text>
                <Text style={styles.eduTitle} numberOfLines={2}>
                  {article.title}
                </Text>
              </View>
              <View style={styles.eduArrow}>
                <Text style={styles.eduArrowText}>›</Text>
              </View>
            </TouchableOpacity>
          ))}

          <View style={{height: Spacing.xxl}} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Top bar
  topBar: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoRow: {flexDirection: 'row', alignItems: 'center'},
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  logoIconText: {
    color: Colors.textLight,
    fontWeight: '900',
    fontSize: 16,
  },
  logoText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 3,
  },

  // Hero
  heroCard: {
    marginHorizontal: Spacing.lg,
    height: 200,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.card,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroWeek: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroName: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
    color: Colors.text,
  },
  heroSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  content: {paddingHorizontal: Spacing.lg},

  // PRO banner
  proBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  proLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  proDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  upgradeBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  upgradeBtnText: {
    color: Colors.textLight,
    fontWeight: '700',
    fontSize: FontSize.xs,
    letterSpacing: 0.5,
  },

  // Gait Score
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },
  gaitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gaitLeft: {},
  gaitScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  gaitScore: {
    fontSize: 64,
    fontWeight: '900',
    color: Colors.primary,
  },
  gaitMax: {
    fontSize: FontSize.xl,
    fontWeight: '400',
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  scoreBadge: {
    backgroundColor: Colors.primary + '25',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  scoreBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.primary,
  },
  complianceCircle: {alignItems: 'center'},
  complianceInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
  },
  complianceValue: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  complianceLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 6,
    letterSpacing: 0.5,
  },

  // Metrics row
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  metricBox: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'flex-start',
  },
  metricValue: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
  },
  metricLabel: {
    fontSize: FontSize.xs - 1,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  metricSub: {
    fontSize: FontSize.xs - 1,
    color: Colors.primary,
    marginTop: 2,
  },

  // Movement Trend
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  trendPill: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  trendPillText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  trendBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 60,
  },
  trendBarCol: {alignItems: 'center', flex: 1},
  trendBar: {
    width: 24,
    borderRadius: 4,
    minHeight: 8,
  },
  trendDay: {
    fontSize: FontSize.xs - 1,
    color: Colors.textMuted,
    marginTop: 6,
  },

  // Quick actions
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  actionBtnPrimary: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  actionBtnText: {
    color: Colors.textLight,
    fontWeight: '700',
    fontSize: FontSize.sm,
  },
  actionBtnOutline: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  actionBtnOutlineText: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: FontSize.sm,
  },

  // Weekly Insight
  insightCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  insightLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  insightText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // Milestones
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  milestonesScroll: {marginBottom: Spacing.lg},
  milestoneCard: {
    width: 90,
    height: 90,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Spacing.xs,
  },
  milestoneUnlocked: {
    borderColor: Colors.primary,
  },
  milestoneIcon: {fontSize: 22, marginBottom: 4},
  milestoneName: {
    fontSize: FontSize.xs - 1,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  milestoneLocked: {color: Colors.textMuted},

  // Education
  eduCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  eduThumb: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceAlt,
    marginRight: Spacing.md,
  },
  eduInfo: {flex: 1},
  eduCategory: {
    fontSize: FontSize.xs - 1,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  eduTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 18,
  },
  eduArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  eduArrowText: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: '700',
  },
});
