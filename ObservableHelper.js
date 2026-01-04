export function createObservableHelper(target) {
    const subscriptions = [];
    return {
        target: target,
        subscribe(observable, propertyName, transform = null) {
            const sub = observable.subscribe(data => target[propertyName] = transform ? transform(data) : data);
            subscriptions.push(sub);
            return sub;
        },
        unsubscribeAll() {
            subscriptions.forEach(sub => sub.unsubscribe());
            subscriptions.length = 0;
        }
    };
}