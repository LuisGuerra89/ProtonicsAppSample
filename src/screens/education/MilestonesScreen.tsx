import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {ScreenContainer, Card} from '../../components';
import {Colors, FontSize, Spacing, BorderRadius} from '../../constants';
import {useNurtureStore} from '../../store';
import type {Milestone} from '../../types';

export function MilestonesScreen() {
  const {milestones} = useNurtureStore();

  const renderItem = ({item}: {item: Milestone}) => {
    const unlocked = !!item.unlockedAt;
    return (
      <Card style={!unlocked ? styles.locked : undefined}>
        <View style={styles.row}>
          <View
            style={[
              styles.iconCircle,
              unlocked ? styles.iconUnlocked : styles.iconLocked,
            ]}>
            <Text style={styles.icon}>
              {item.icon === 'shoe-print'
                ? '👟'
                : item.icon === 'trending-up'
                ? '📈'
                : item.icon === 'fire'
                ? '🔥'
                : item.icon === 'star'
                ? '⭐'
                : item.icon === 'medal'
                ? '🏅'
                : item.icon === 'trophy'
                ? '🏆'
                : '🎯'}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, !unlocked && styles.titleLocked]}>
              {item.title}
            </Text>
            <Text style={styles.description}>{item.description}</Text>
            {unlocked && item.unlockedAt && (
              <Text style={styles.unlockedDate}>
                Unlocked {new Date(item.unlockedAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      </Card>
    );
  };

  return (
    <ScreenContainer title="Milestones">
      <FlatList
        data={milestones}
        keyExtractor={m => m.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {paddingBottom: Spacing.xxl},
  locked: {opacity: 0.6},
  row: {flexDirection: 'row', alignItems: 'center'},
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconUnlocked: {backgroundColor: Colors.primary + '20'},
  iconLocked: {backgroundColor: Colors.surfaceAlt},
  icon: {fontSize: 24},
  textContainer: {flex: 1},
  title: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  titleLocked: {color: Colors.textSecondary},
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  unlockedDate: {
    fontSize: FontSize.xs,
    color: Colors.success,
    marginTop: 4,
    fontWeight: '500',
  },
});
