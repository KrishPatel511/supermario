// A tiny event bus so React and Phaser can talk without
// ever directly importing/touching each other's internals.
//
// Phaser side: EventBus.emit('score-changed', 10)
// React side:  EventBus.on('score-changed', (score) => setScore(score))

import Phaser from 'phaser';

class EventBusClass extends Phaser.Events.EventEmitter {}

export const EventBus = new EventBusClass();
