interface Subscriber {
  callBack: Function;
  id: string;
}

interface EventDescriptor {
  name: string;
  subscribers: Subscriber[];
}

interface Event {
  name: string;
  data: any;
  timestamp: Date;
}

interface PubSubOptions {
  collectPreviousEvents?: boolean;
}

export class PubSub {
  events: EventDescriptor[] = [];
  eventQueue: Event[] = [];
  eventHistory: Event[] = [];
  subscriberCount: number = 0;

  constructor() {
    this.handleSubscription = this.handleSubscription.bind(this);
    this.handleBroadcast = this.handleBroadcast.bind(this);
    this.publishPreviousEvents = this.publishPreviousEvents.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.broadcast = this.broadcast.bind(this);
  }

  subscribe(
    eventName: string,
    callBack: Function,
    options: PubSubOptions,
  ): string {
    if (typeof callBack !== 'function') return '';

    const subscriber = {
      callBack,
      id: `sub-${++this.subscriberCount}`,
    };

    this.handleSubscription(eventName, subscriber);
    this.publishPreviousEvents(eventName, subscriber, options);

    return subscriber.id;
  }

  unsubscribe(eventName: string, subscriberId: string) {
    if (!subscriberId) return;

    const targetEvent = this.events.find(e => {
      return e.name === eventName;
    });

    if (targetEvent) {
      const index = targetEvent.subscribers.findIndex(subscriber => {
        return subscriber.id === subscriberId;
      });

      if (index >= 0) {
        targetEvent.subscribers.splice(index, 1);
      }
    }
  }

  broadcast(eventName: string, data: any) {
    const event = {
      data,
      name: eventName,
      timestamp: new Date(),
    };

    this.handleBroadcast(event);
  }
  private publishEvent(subscriber: Subscriber, data: any) {
    setTimeout(() => {
      try {
        subscriber.callBack(data);
      } catch (e) {}
    }, 0);
  }

  private handleSubscription(eventName: string, subscriber: Subscriber) {
    let event = this.events.find(e => {
      return e.name === eventName;
    });

    if (event) {
      event.subscribers.push(subscriber);
    } else {
      event = {
        name: eventName,
        subscribers: [subscriber],
      };

      this.events.push(event);
    }
  }

  private handleBroadcast(event: Event) {
    const targetEvent = this.events.find(e => {
      return e.name === event.name;
    });

    if (targetEvent) {
      targetEvent.subscribers.forEach(subscriber => {
        this.publishEvent(subscriber, event.data);
      });

      this.eventHistory.push(event);
    } else {
      this.eventQueue.push(event);
    }
  }

  private publishPreviousEvents(
    eventName: string,
    subscriber: Subscriber,
    options: PubSubOptions,
  ) {
    if (typeof options === 'object' && options.collectPreviousEvents) {
      this.eventQueue
        .filter(e => {
          return e.name === eventName;
        })
        .forEach(e => {
          this.publishEvent(subscriber, e.data);
        });
    }
  }
}
