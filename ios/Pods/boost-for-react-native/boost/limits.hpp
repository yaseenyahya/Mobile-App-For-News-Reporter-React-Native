import { MonoTypeOperatorFunction } from '../types';
/**
 * The Min operator operates on an Observable that emits numbers (or items that can be compared with a provided function),
 * and when source Observable completes it emits a single item: the item with the smallest value.
 *
 * ![](min.png)
 *
 * ## Examples
 * Get the minimal value of a series of numbers
 * ```ts
 * import { of } from 'rxjs';
 * import { min } from 'rxjs/operators';
 *
 * of(5, 4, 7, 2, 8).pipe(
 *   min(),
 * )
 * .subscribe(x => console.log(x)); // -> 2
 * ```
 *
 * Use a comparer function to get the minimal item
 * ```typescript
 * import { of } from 'rxjs';
 * import { min } from 'rxjs/operators';
 *
 * interface Person {
 *   age: number,
 *   name: string
 * }
 * of<Person>(
 *   {age: 7, name: 'Foo'},
 *   {age: 5, name: 'Bar'},
 *   {age: 9, name: 'Beer'},
 * ).pipe(
 *   min<Person>( (a: Person, b: Person) => a.age < b.age ? -1 : 1),
 * )
 * .subscribe((x: Person) => console.log(x.name)); // -> 'Bar'
 * ```
 * @see {@link max}
 *
 * @param {Function} [comparer] - Optional comparer function that it will use instead of its default to compare the
 * value of two items.
 * @return {Observable<R>} An Observable that emits item with the smallest value.
 * @method min
 * @owner Observable
 */
export declare function min<T>(comparer?: (x: T, y: T) => number): MonoTypeOperatorFunction<T>;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        UBSTITUTION (){ return ULLONG_MIN; }
      static BOOST_ULLT max BOOST_PREVENT_MACRO_SUBSTITUTION (){ return ULLONG_MAX; }
#elif defined(ULONGLONG_MAX) && defined(ULONGLONG_MIN)
      static BOOST_ULLT min BOOST_PREVENT_MACRO_SUBSTITUTION (){ return ULONGLONG_MIN; }
      static BOOST_ULLT max BOOST_PREVENT_MACRO_SUBSTITUTION (){ return ULONGLONG_MAX; }
#else
      static BOOST_ULLT min BOOST_PREVENT_MACRO_SUBSTITUTION (){ return 0uLL; }
      static BOOST_ULLT max BOOST_PREVENT_MACRO_SUBSTITUTION (){ return ~0uLL; }
#endif
      BOOST_STATIC_CONSTANT(int, digits = sizeof(BOOST_LLT) * CHAR_BIT);
      BOOST_STATIC_CONSTANT(int, digits10 = (CHAR_BIT * sizeof (BOOST_LLT)) * 301L / 1000);
      BOOST_STATIC_CONSTANT(bool, is_signed = false);
      BOOST_STATIC_CONSTANT(bool, is_integer = true);
      BOOST_STATIC_CONSTANT(bool, is_exact = true);
      BOOST_STATIC_CONSTANT(int, radix = 2);
      static BOOST_ULLT epsilon() throw() { return 0; };
      static BOOST_ULLT round_error() throw() { return 0; };

      BOOST_STATIC_CONSTANT(int, min_exponent = 0);
      BOOST_STATIC_CONSTANT(int, min_exponent10 = 0);
      BOOST_STATIC_CONSTANT(int, max_exponent = 0);
      BOOST_STATIC_CONSTANT(int, max_exponent10 = 0);

      BOOST_STATIC_CONSTANT(bool, has_infinity = false);
      BOOST_STATIC_CONSTANT(bool, has_quiet_NaN = false);
      BOOST_STATIC_CONSTANT(bool, has_signaling_NaN = false);
      BOOST_STATIC_CONSTANT(bool, has_denorm = false);
      BOOST_STATIC_CONSTANT(bool, has_denorm_loss = false);
      static BOOST_ULLT infinity() throw() { return 0; };
      static BOOST_ULLT quiet_NaN() throw() { return 0; };
      static BOOST_ULLT signaling_NaN() throw() { return 0; };
      static BOOST_ULLT denorm_min() throw() { return 0; };

      BOOST_STATIC_CONSTANT(bool, is_iec559 = false);
      BOOST_STATIC_CONSTANT(bool, is_bounded = true);
      BOOST_STATIC_CONSTANT(bool, is_modulo = true);

      BOOST_STATIC_CONSTANT(bool, traps = false);
      BOOST_STATIC_CONSTANT(bool, tinyness_before = false);
      BOOST_STATIC_CONSTANT(float_round_style, round_style = round_toward_zero);
      
  };
}
#endif 

#endif

