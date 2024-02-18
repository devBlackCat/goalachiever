// src/components/AppFooter.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AppFooter = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('ScheduleListView')}>
                <Text style={styles.footerText}>일정리스트</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('CalendarScreen')}>
                <Text style={styles.footerText}>캘린더</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('BoardScreen')}>
                <Text style={styles.footerText}>게시판</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('MyPageScreen')}>
                <Text style={styles.footerText}>마이페이지</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        backgroundColor: 'black',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    footerItem: {
        flex: 1,
        alignItems: 'center',
    },
    footerText: {
        color: 'white',
    },
});

export default AppFooter;
