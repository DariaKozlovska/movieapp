// import React from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import { useAuth } from '@/contexts/AuthContext';
// import { Redirect } from 'expo-router';

// export default function AuthGate({ children }: { children: React.ReactNode }) {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator />
//       </View>
//     );
//   }

//   if (!user) {
//     return <Redirect href="/welcome" />;
//   }

//   return <>{children}</>;
// }