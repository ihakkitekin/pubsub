### Import the module

```import { PubSub } from 'ty-pubsub'```

or

```const { PubSub } = require('ty-pubsub')```

### Create an instance

`const pubsub = new PubSub()`

### Subscribe to an event

```const subscriberId = pubsub.subscribe('eventName', function() {...}, options)```

```
interface PubSubOptions {
  collectPreviousEvents?: boolean;
}
```

### Unsubscribe

```pubsub.unsubscribe('eventName', subscriberId)```

### Broadcast an event

```pubsub.broadcast('eventName', data)```