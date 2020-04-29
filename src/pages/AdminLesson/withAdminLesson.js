import React from 'react';

const withAdminLesson = WrappedComponent => {
    return props => {
        return <WrappedComponent {...props} />;
    };
};

export default withAdminLesson;
