jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return new Proxy(
    {},
    {
      get: () => (props: any) => React.createElement(View, { ...props, testID: 'lucide-icon' }),
    },
  );
});
