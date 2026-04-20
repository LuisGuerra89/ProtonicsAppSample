import React from 'react';
import {Text, StyleSheet, ScrollView} from 'react-native';
import {ScreenContainer} from '../../components';
import {Colors, FontSize, Spacing} from '../../constants';
import type {EducationArticle} from '../../types';

interface Props {
  route: {params: {article: EducationArticle}};
}

export function ArticleDetailScreen({route}: Props) {
  const {article} = route.params;

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <Text style={styles.category}>
          {article.category.toUpperCase()} · {article.readTimeMinutes} min read
        </Text>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.body}>{article.content}</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {paddingTop: Spacing.lg, paddingBottom: Spacing.xxl},
  category: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  body: {
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 26,
  },
});
