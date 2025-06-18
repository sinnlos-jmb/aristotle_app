const arbol={
bien: { peso:1, //algunos pesos tienen que ser jsons para marcar tipo de valor, ie, si son resumenes, definiciones, enumeraciones, etc.
        metadata:{libro:1, cap:9, dependencia:0},// dependencia alta=> traer todos los chunks del capitulo (salvo los marcados como garbage)
        jerarquia:0, //cuando se evalúa orden de ciertos bienes
        esfera: {ps: {peso:0, referencia: {ejemplo:0, ti_estin:0, vs_px:0, interes_poietico:0}}, px:0, th:0},
        arete:0, // despues se marca peso alto en phusis o pneuma para especificar.
        phusis: {peso: 1, 
                conceptos: {peso:0, 
                        movimiento: {peso:0,
                                literal:0, 
                                relacionable:0, //w-vi phusis=>movimiento, w-vi, no está tematizado normalmente pero suma buscar la conexion con este punto, ie, siempre buscar relacion con base phusika de la ek.
                                origen:0, // genesis y primer ppio de los movimientos phusikoi, arkhe referido a la accón dentro de psuche ... arche en uno mismo es lo que cuenta (vs arche en phusis, chance, fuerza ajena, etc.) es condicion para virtud (actos voluntarios y con proairesis). 
                                telos:{peso: 0, 
                                        tipo: {energetico:0, productivo:0, por_otro:0, por_si:0},  //en gral, sobre cada bien puede hablar específicamente del telos de ese bien.
                                        jerarquia:0 // espejo con jerarquia de bienes, pero no vs (max-bien es fin-ultimo).
                                        }
                                },                        
                        th_phusis: 0, 
                        ergon: {peso:0, th:0, e_argument:0}, // funcion característica de cada ente, mientras mejor cumpla, mayor bien, valor, agradable a dioses su vida.
                        grado: {peso:0,
                                to_metron:0,
                                max_bien :{peso:0, //eudaimonia se marca dentro de hexeis para especificar el tipo de max-bien aludido en el chunk
                                        complete:0, 
                                        self_sufficient:0, 
                                        efectos:[pleasure ], //(it's pleasurable in itself), teleios y autarcheia
                                        medios_necesarios: ["friends", "wealth", "political power"],
                                        vs_blessedness:0,
                                        ti_estin:0 //teorización, para la ek es actividad de psuche! (according to complete virtue)
                                        },
                                moderado:0, //no arete full, pero b-virtudes adquiridas... v-corto de eudaimonia, ni siquiera en camino, actividad according to complete virtue.
                                hoi_polloi:0, //mayoría bastante viciosa, entregada a maximizar deleites
                                maldad:0 //enfermos por vicios (tiranos, adúlteros, etc.)
                                },
                        nomos_vs_phusis:0, // convenciones, vi grado de subjetivismo
                        },
                tipos_bien_natural: {peso:0, 
                                externo:{peso:0, 
                                        aparentes:{peso: 0, enum: [prosperidad, techo, comida, oxigeno, agua, auto, caballos, esclavos]} //bienes fuera de su justa medida, los bienes externos son w-vi para la felicidad 
                                        },
                                body: {peso:0, enum_bienes: salud, fuerza }, 
                                psuche: { peso:0, 
                                        pasios: {peso:0, th:0, enum:{} }, //prolog: pertenece a parte alogon-sensitiva: gozo:0, dolor:0, placer:0!!.
                                        caracter: {},
                                        accion: {peso:0, partes:{peso:0, wll:0, proairesis:0, deliberacion:0}},//prolog: activities producen corresponding characters in people
                                        hexeis: {peso:0,
                                                vicio:0,
                                                virtud: {peso:0,  
                                                        th_ti_estin:0, //definicion
                                                        origin: 0, // teaching + habituation (no x phusis)
                                                        tipo:{peso:0, eth:0, dth:0}, //eth-vs-deth=>1,1 
                                                        enum: {peso:0, andreia:0, templanza:0, magnanimidad:0},
                                                        justo_medio:0,
                                                        the_noble:0, // w-vi porque acompaña every virtue.
                                                        delight:0, // acciones que surgen de hexeis virtuosos, son acompañadas por deleite
                                                        objects_of_choice: {peso:0, honor:0, utilidad:0, placer:0}, //max-vi placer, honour is the prize of virtue (great-souled se ocupa de los honores, ok en todo respecto cuáles, cuándo, medida, motivo-finalidad, etc. 
                                                        objects_of_avoidance: {peso:0, shame:0, daño:0, dolor:0},
                                                        agente: {peso:0, hexis:0, eidos:0, proairesis:0, firm_character:0} //condiciones_del agente para que accion sea virtuosa (hexis: disposicion desde la que se actúa, elegir lo se va a hacer por su valor, y caracter w-firme)
                                                        },
                                                efectos:{peso:0, eudaimonia:0, libertad:0, nobleza:0} //no son movimientos naturales!
                                                },
                                        partes: {peso:0, //tres 'componentes' del alma: pathe (feelings), dunameis y hexeis.
                                                alogon: {peso:0,  
                                                        vegetativa:0, 
                                                        sensitiva: {peso:0, 
                                                                bienes:{peso:0, placer:0, riqueza:0, honor:0},
                                                                appetite:0, 
                                                                wll:0, //vs tirar carga por la borda durante tormenta
                                                                dunameis:{}, //no parece muy relevante: capacidad para sentir, etc.
                                                                hexeis: {peso:0, andreia:{peso:1, defecto:0, exceso:0, objeto:0}, templanza:0, generocity:0, magnificence:0, autenticidad:0, eutrapelia:0, justicia:0} // v. eticas, en 3.10 dice que coraje y templanza son las de la parte alogon, tal vez haya que distinguir más.
                                                                }
                                                        }, 
                                                logon: {peso:0, 
                                                        acciones_racionales:{peso:0, proairesis:0, deliberacion:0, first_principle:0},//acciones noeticas y pneumaticas... rational choice vs appetite and wish, first_principle en mismo ser humano - caute a phusis se puede llegar a pneuma/primer_motor también.
                                                        dunameis:{},  
                                                        hexeis: { peso:0, techne:0, phronesis:0, sophia:0  } // v. dianoeticas 
                                                        } 
                                                } 
                                        }, 
                                politike: {peso:0, 
                                        conceptos: {peso:0, 
                                                max_bien: 0, // estado etico
                                                eu_vs_ko: 0,  // diferencia entre estado etico y comunidades ko
                                                paideia:0, // educacion a nivel estatal 
                                                ley:0,
                                                justicia_politica:0, //w-fuerte casi equivalente a 'virtud', toda virtud está contenida en este tipo de justica, respladado por leyes.
                                                estadios: {peso:0, flia:0, soc_civil:0, estado:0},
                                                } 
                                        }, 
                                }
                },
        penuma:{peso:0,
                tipo_bien:{peso:0, divinizacion:0 }, //(ver virtudes teologales)
                ciencia: {peso:0, 
                        comparacion:0, 
                        ciencias: {peso:0, 
                                        fs:0, mth_geom:0, nz_bio:0, lk:0, 
                                        px:{peso:0, ek:1, plt:0, th:0, generalidades:0, finalidad:0, gnoseologia:0}, //ctdo del chunk referido a la ek (finalidad de estudiarla, o en qué consiste y sus partes, eg, si plt es parte o no, cuándo enseñarla, tipo de conocimiento, etc., th es lo referido a ode de la ek, acciones, bienes realizables mediante la accion humana, etc.) 
                                        enum:["militar", "medicina", "politica", "filosofia", "economía", "ingeniería"]}, //(ccº de tekhnai)
                        grado_precision:0, //max-vi esta categ insiste un montón en esto.
                        opiniones:0, //doxa de hoi polloi sobre el tema que esté marcado, eg, felicidad.
                        biologia:0,
                        logica:0
                        }, 
                conceptos: {peso: 0, 
                        energeia:0, 
                        dunamis:0,
                        logos:0, 
                        ontologia: {peso:0, ousia:0, to_ti_en_einai:0, hupekeimenon:0}, 
                        to_metron:0, 
                        causa: {peso: 0, origen: {chance:0, 
                                                dioses:0, 
                                                phusis: {peso:0, 
                                                        espontaneo:0, 
                                                        proceso:{peso:0, opciones: {training:0, habituation:0, learning:0} } //adquirir bienes intermedios
                                                        },
                                                logica:0, 
                                                teoria:0 //reflexion acerca de la causalidad (también puede marcar teorizacion acerca de chance_as_cause, o phusis_as_cause)
                                                }
                                }
                        }
                }
        }, //fin bien
        referencias:{peso:0, 
                internas:{peso:0, ek: 0, mfk:0, bio:0, lk:0}, 
                estructura:0, 
                externas:{peso: 0, platon:0, presoc:0, sofistas:0, hoi_polloi:0},
                valoracion:0},
        segundo_grado: {} //redes neuronales con afirmaciones que pueden aparecer repetidas veces en distintos chunks...
  };