describe('Just', function () {
    var root,
        just;

    beforeEach(function () {
        root = document.querySelector('#jasmine_fixture');
        just = new Just(root);
    });

    it('duplicates elements according to data', function (done) {
        var r = '<i class="e1"></i><i class="e1"></i>';
        var h = '<i class="e1"></i>';
        var d = {a: {b: [0, 0]}};
        var p = 'a.b.';
        var s = 'e1';

        just.data(d);
        root.innerHTML = h;
        just.with(s).each(p);

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(r);
            done();
        });
    });

    it('sets innerHTML according to data', function (done) {
        var r = '<i class="e1">c</i><i class="e1">d</i>';
        var h = '<i class="e1"> </i>';
        var d = {x: {y: ['c', 'd']}};
        var p = 'x.y.';
        var s = 'e1';

        just.data(d);
        root.innerHTML = h;
        just.with(s).each(p).call(setHTML);

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(r);
            done();
        });

        function setHTML(val, key) {
            return function (e1) {
                e1.innerHTML = val(0);
            }
        }
    });

    it('supports filtering data', function (done) {
        var d = {x: {y: [true, false, true]}};
        var r = '<i class="e1">0</i><i class="e1">2</i>';
        var h = '<i class="e1"> </i>';
        var p = 'x.y.';
        var s = 'e1';

        just.data(d);
        root.innerHTML = h;
        just.with(s).each(p).call(setHTML);

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(r);
            done();
        });

        function setHTML(val, key) {
            if (val(0)) return function (e1) {
                e1.innerHTML = key(0);
            }
        }
    });

    it('supports two data paths', function (done) {
        var r = '<i class="e1">2</i><i class="e1">8</i>';
        var d = {x: {a: [1, 4], b: [1, 4]}};
        var h = '<i class="e1"> </i>';
        var p1 = 'x.a.';
        var p2 = 'x.b.';
        var s = 'e1';

        just.data(d);
        root.innerHTML = h;
        just.with(s).each(p1).each(p2).call(setHTML);

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(r);
            done();
        });

        function setHTML(val, key) {
            if (val(0) === val(1)) return function (e1) {
                e1.innerHTML = val(0) + val(1);
            }
        }
    });

    it('supports three data paths', function (done) {
        var r = '<i class="e1">3</i><i class="e1">6</i><i class="e1">9</i>';
        var d = {x: {a: [1, 2, 3], b: [1, 2, 3], c: [1, 2, 3]}};
        var h = '<i class="e1"> </i>';
        var p1 = 'x.a.';
        var p2 = 'x.b.';
        var p3 = 'x.c.';
        var s = 'e1';

        just.data(d);
        root.innerHTML = h;
        just.with(s).each(p1).each(p2).each(p3).call(setHTML);

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(r);
            done();
        });

        function setHTML(val, key) {
            if (val(0) === val(1) && val(1) === val(2)) return function (e1) {
                e1.innerHTML = val(0) + val(1) + val(2);
            }
        }
    });

    it('each() exhausts every data path data combination', function (done) {
        var r = '<i class="e1">00</i><i class="e1">01</i><i class="e1">10</i><i class="e1">11</i>';
        var d = {x: {a: [true, true], b: [true, true]}};
        var h = '<i class="e1">  </i>';
        var p1 = 'x.a.';
        var p2 = 'x.b.';
        var s = 'e1';

        just.data(d);
        root.innerHTML = h;
        just.with(s).each(p1).each(p2).call(setHTML);

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(r);
            done();
        });

        function setHTML(val, key) {
            return function (e1) {
                e1.innerHTML = key(0) + '' + key(1);
            }
        }
    });

    it('some() pursues data path combinations until return', function (done) {
        var d = {x: {a: [true, true], b: [true, true]}};
        var r = '<i class="e1">00</i><i class="e1">10</i>';
        var h = '<i class="e1">  </i>';
        var p1 = 'x.a.';
        var p2 = 'x.b.';
        var s = 'e1';

        just.data(d);
        root.innerHTML = h;
        just.with(s).each(p1).some(p2).call(setHTML);

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(r);
            done();
        });

        function setHTML(val, key) {
            return function (e1) {
                e1.innerHTML = key(0) + '' + key(1);
            }
        }
    });

    it('supports clustered list', function (done) {
        var r = '<hr><i class="e1">1</i><i class="e2">1</i><i class="e1">2</i><i class="e2">2</i><hr>';
        var h = '<hr><i class="e1"> </i><i class="e2"> </i><hr>';
        var d = {x: {y: [1, 2]}};
        var p = 'x.y.';
        var s1 = 'e1';
        var s2 = 'e2';

        just.data(d);
        root.innerHTML = h;
        just.with(s1).each(p).call(setHTML);
        just.with(s2).each(p).call(setHTML);

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(r);
            done();
        });

        function setHTML(val, key) {
            return function (e1) {
                e1.innerHTML = val(0);
            }
        }
    });

    it('render() maintains input focus', function (done) {
        var h = '<input class="e1">';
        var d = {x: {y: [1, 2]}};
        var p = 'x.y.';
        var s = 'e1';

        just.data(d);
        root.innerHTML = h;
        just.with(s).each(p);
        root.firstChild.focus();
        expect(root.firstChild).toBe(document.activeElement);

        requestAnimationFrame(function () {
            expect(root.firstChild).toBe(document.activeElement);
            done();
        });
    });

    it('render() passes data to descendant bindings', function (done) {
        var r = '<i class="e1"><i class="e2"><i class="e3">02</i></i><i class="e2"><i class="e3">03</i></i></i><i class="e1"><i class="e2"><i class="e3">12</i></i><i class="e2"><i class="e3">13</i></i></i>';
        var h = '<i class="e1"><i class="e2"><i class="e3"> </i></i></i>';
        var d = {x: {a: ['0', '1'], b: ['2', '3']}};
        var p1 = 'x.a.';
        var p2 = 'x.b.';
        var s1 = 'e1';
        var s2 = 'e2';
        var s3 = 'e3';

        just.data(d);
        root.innerHTML = h;
        just.with(s1).each(p1);
        just.with(s2).each(p2);
        just.with(s3).each(p1).each(p2).call(setHTML);

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(r);
            done();
        });

        function setHTML(val, key) {
            return function (e1) {
                e1.innerHTML = val(0) + val(1);
            }
        }
    });

    it('render() calls non-DOM-bound functions', function (done) {
        var d = {w: 0, x: {y: [{z: 1}, {z: 2}]}};
        var r = '<i class="e1">012</i>';
        var h = '<i class="e1"></i>';
        var p1 = 'x.y.z';
        var p2 = 'w';
        var s = 'e1';

        just.data(d);
        root.innerHTML = h;
        just.each(p1).each(p2).call(addVal);
        just.with(s).each(p2).call(setHTML);

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(r);
            done();
        });

        function addVal(val, key) {
            val(1, val(1) + '' + val(0));
        }

        function setHTML(val, key) {
            return function (e1) {
                e1.innerHTML = val(0);
            }
        }
    });

    it('setting values via val() causes re-render', function (done) {
        var r1 = '<i class="e1">a</i><i class="e1">b</i>';
        var r2 = '<i class="e1">x</i><i class="e1">b</i>';
        var r3 = '<i class="e1">x</i><i class="e1">x</i>';
        var h = '<i class="e1"></i>';
        var d = {x: ['a', 'b']};
        var p = 'x.';
        var s = 'e1';

        just.data(d);
        root.innerHTML = h;
        just.with(s).each(p).call(setHTML);

        function setHTML(val, key) {
            return function (e1) {
                e1.innerHTML = val(0);
                e1.onclick = function () {
                    val(0, 'x');
                }
            };
        }

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(r1);
            root.firstChild.onclick();

            requestAnimationFrame(function () {
                expect(root.innerHTML).toBe(r2);
                root.lastChild.onclick();

                requestAnimationFrame(function () {
                    expect(root.innerHTML).toBe(r3);
                    done();
                })
            })
        });
    });

    it('setting values via key() causes re-render', function (done) {
        var r1 = '<i class="e1">a</i><i class="e1">b</i>';
        var r2 = '<i class="e1">x</i><i class="e1">b</i>';
        var r3 = '<i class="e1">x</i>';
        var h = '<i class="e1"></i>';
        var d = {x: {a: 1, b: 1}};
        var p = 'x.';
        var s = 'e1';

        just.data(d);
        root.innerHTML = h;
        just.with(s).each(p).call(setHTML);

        function setHTML(val, key) {
            return function (e1) {
                e1.innerHTML = key(0);
                e1.onclick = function () {
                    key(0, 'x');
                }
            };
        }

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(r1);
            root.firstChild.onclick();

            requestAnimationFrame(function () {
                expect(root.innerHTML).toBe(r2);
                root.lastChild.onclick();

                requestAnimationFrame(function () {
                    expect(root.innerHTML).toBe(r3);
                    done();
                })
            })
        });
    });

    it('init() works like call(), but executes the function only once', function (done) {
        var r1 = '<i class="e1">1</i><i class="e1">1</i>';
        var r2 = '<i class="e1">2</i><i class="e1">1</i>';
        var h = '<i class="e1"> </i>';
        var d = {x: {y: [0, 0]}};
        var p1 = 'x.y.0';
        var p2 = 'x.y.1';
        var p3 = 'x.y.';
        var s = 'e1';

        just.data(d);
        root.innerHTML = h;
        just.each(p1).call(addVal);
        just.each(p2).init(addVal);
        just.with(s).each(p3).call(setHTML);

        function addVal(val, key) {
            val(0, val(0) + 1);
        }

        function setHTML(val, key) {
            return function (e1) {
                e1.innerHTML = val(0);
                e1.onclick = function () {
                    val(0, val(0));
                };
            };
        }

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(r1);
            root.firstChild.onclick();

            requestAnimationFrame(function () {
                expect(root.innerHTML).toBe(r2);
                done();
            });
        });
    });

    it('supports multiple bindings per element', function (done) {
        var r = '<i class="e1 e2">1</i><i class="e1 e2">3</i>';
        var h = '<i class="e1 e2"> </i>';
        var d = {a: {b: [0, 1, 2, 3]}};
        var p = 'a.b.';
        var s1 = 'e1';
        var s2 = 'e2';

        just.data(d);
        root.innerHTML = h;
        just.with(s1).each(p).call(setHTML);
        just.with(s2).each(p).call(filterOdd);

        function filterOdd(val, key) {
            if (val(0) % 2) return function (e1) {
            }
        }

        function setHTML(val, key) {
            return function (e1) {
                e1.innerHTML = val(0);
            }
        }

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(r);
            done();
        });
    });

    it('handles zero-length lists', function (done) {
        var r1 = '<i class="e1 e2" style="display: none;">3</i>';
        var r2 = '<i class="e1 e2" style="">1</i><i class="e1 e2">3</i>';
        var h = '<i class="e1 e2"></i>';
        var d = {a: {b: [0, 1, 2, 3], c: 0}};
        var p1 = 'a.b.';
        var p2 = 'a.c';
        var s1 = 'e1';
        var s2 = 'e2';

        just.data(d);
        root.innerHTML = h;
        just.with(s1).each(p1).each(p2).call(setHTML);
        just.with(s2).each(p1).each(p2).call(filterOut);

        function filterOut(val, key) {
            if (val(0) % val(1)) return function () {}
        }

        function setHTML(val, key) {
            return function (e1) {
                e1.innerHTML = val(0);
                e1.onclick = function () {
                    val(1, 2);
                }
            }
        }

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(r1);
            root.firstChild.click();

            requestAnimationFrame(function () {
                expect(root.innerHTML).toBe(r2);
                done();
            });
        });
    });

    it('supports multiple bindings per class', function (done) {
        var r = '<i class="e1">02</i><i class="e1">13</i>';
        var d = {a: {b: [0, 1], c: [2, 3]}};
        var h = '<i class="e1"></i>';
        var p1 = 'a.b.';
        var p2 = 'a.c.';
        var s = 'e1';

        just.data(d);
        root.innerHTML = h;
        just.with(s).each(p1).call(setHTML);
        just.with(s).each(p2).call(setHTML);

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(r);
            done();
        });

        function setHTML(val, key) {
            return function (e1) {
                e1.innerHTML += val(0);
            }
        }
    });

    it("supports late definition of bindings", function (done) {
        var r = '<i class="e1">1</i><i class="e1">2</i>';
        var d1 = {x: {a: [11, 12], b: 5}};
        var d2 = {y: 'x.a.', z: 'x.b'};
        var h = '<i class="e1"></i>';
        var p1 = 'y';
        var p2 = 'z';
        var s = 'e1';

        just.data(d1);
        root.innerHTML = h;
        just.each(p1).each(p2).init(initBindings);

        function initBindings(val, key) {
            just.with(s).each(val(0)).each(val(1)).call(setHTML);
        }

        function setHTML(val, key) {
            return function (e1) {
                e1.innerHTML = val(0) % val(1);
            }
        }

        requestAnimationFrame(function () {
            expect(root.innerHTML).toBe(h);
            just.data(d2);

            requestAnimationFrame(function () {
                expect(root.innerHTML).toBe(r);
                done();
            });
        });
    });
});