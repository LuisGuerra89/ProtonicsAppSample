import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {ScreenContainer, Card} from '../../components';
import {Colors, FontSize, Spacing, BorderRadius} from '../../constants';
import {useNurtureStore} from '../../store';
import type {EducationArticle} from '../../types';

interface Props {
  navigation: any;
}

const categoryColors: Record<string, string> = {
  nmre: Colors.primary,
  positioning: Colors.info,
  pain: Colors.warning,
  progress: Colors.success,
};

const categoryLabels: Record<string, string> = {
  nmre: 'NMRE',
  positioning: 'Positioning',
  pain: 'Pain & Conditions',
  progress: 'Progress',
};

export function EducationScreen({navigation}: Props) {
  const {articles} = useNurtureStore();

  const renderItem = ({item}: {item: EducationArticle}) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ArticleDetail', {article: item})}>
      <Card>
        <View style={styles.tagRow}>
          <View
            style={[
              styles.tag,
              {backgroundColor: (categoryColors[item.category] ?? Colors.primary) + '20'},
            ]}>
            <Text
              style={[
                styles.tagText,
                {color: categoryColors[item.category] ?? Colors.primary},
              ]}>
              {categoryLabels[item.category] ?? item.category}
            </Text>
          </View>
          <Text style={styles.readTime}>{item.readTimeMinutes} min read</Text>
        </View>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.summary} numberOfLines={2}>
          {item.summary}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer title="Learn" tabScreen>
      <FlatList
        data={articles}
        keyExtractor={a => a.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {paddingBottom: Spacing.xxl},
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  tagText: {fontSize: FontSize.xs, fontWeight: '600'},
  readTime: {fontSize: FontSize.xs, color: Colors.textSecondary},
  articleTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  summary: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
