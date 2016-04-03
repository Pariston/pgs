$().ready(function() {
  var nextButton                  = $("#next"),
      prevButton                  = $("#prev"),
      container                   = $(".container"),
      userFormContainer           = $("#userFormContainer"),
      showUserInfoButton          = $("#showUserInfoButton"),
      errorMessage                = $("#errorMessage"),
      userInfo                    = $("#userInfo").hide(),
      counter                     = 0; //zmienną kontroluję numer "okna". 0 - pierwsze okno

  var tab2 = [
      {
        task: 'Podaj imie',
        input: '<input type="text" id="userName" placeholder="Podaj imię..." class="taskInput" />',
        regex: /^[a-zA-Z]+$/,
        required: true
      },
      {
        task: 'Podaj nazwisko',
        input: '<input type="text" id="userSurname" placeholder="Podaj nazwisko..." class="taskInput" />',
        regex: /^[a-zA-Z]+$/,
        required: true
      },
      {
        task: 'Podaj adres',
        input: '<input type="text" id="userAddress" placeholder="Podaj adres..." class="taskInput" />',
        regex: /^[a-zA-Z0-9 ]+$/,
        required: true
      },
      {
        task: 'Podaj nr telefonu',
        input: '<input type="text" id="userPhone" placeholder="Podaj nr telefonu..." class="taskInput" />',
        regex: /^[0-9]+$/,
        required: true
      }
  ];

  //funkcja dodająca do lewego menu listę krokow z uwzględnieniem kroku aktualnego
  refreshLeftMenu = function() {
    $("#leftMenu li").each(function() {
      $(this).remove();
    });

    for(var i = 0; i < tab2.length; i++) {
      if(i === counter) $("#leftMenu").append("<li class='active'>" + tab2[i].task + "</li>");
      else $("#leftMenu").append("<li>" + tab2[i].task + "</li>");
    }
  };

  //funkcja zamieniająca okna, ich zawartości i tak dalej
  setWindow = function() {
    $("#userFormContainer form div.formContent").replaceWith(
      "<div class='formContent'>" +
      "<p class='task'>" + tab2[counter].task + "</p>" +
      "<p>" + tab2[counter].input + "</p>" +
      "</div>"
    );
  };

  //funkcja ustawiająca focus na pole tekstowe w aktualnym oknie
  focusInput = function() {
    $("#userFormContainer form input[type='text']").each(function() {
      $(this).focus();
    });
  };

  //Ustawienie, by kliknięcie przycisku "submit" nie odświeżało strony
  $("#userFormContainer form").submit(function(e) {
    return false;
  });

  /*
    Na starcie aplikacji wykonywane są następujące kroki:
    1. Dodawane jest pierwsze okno za pomocą funkcji setWindow
    2. Na pole tekstowe w aktualnym oknie ustawiany jest focus za pomocą funkcji focusInput
    3. Generowane jest lewe menu zawierające listę krokow z uwzględnieniem (nadanie klasy CSS) kroku aktualnego
  */

  setWindow();
  focusInput();
  refreshLeftMenu();

  //Obiekt użytkownika, ktory zawiera wszystkie wymagane pola
  var user = {
    name:       "",
    surname:    "",
    address:    "",
    phone:      ""
  };

  $("#next").click(function() {
    if(!hasErrors("#userFormContainer form p input[type='text']")) {
      //w innym przypadku zwiększam wartość licznika i wywołuję metodę checkCounter, ktora aktualizuje
      //dane w obiekcie "user"
      counter++;
      checkCounter();
      refreshLeftMenu();
      //w tym miejscu usuwam z drzewa DOM dawną zawartość formularza i wstawiam kolejne pola
      //dzięki temu użytkownik nie ma możliwości manipulować formularzem np. poprzez zmianę stanu widoczności
      //w konsoli przeglądarki (zmianę wartości CSS/html)
      setWindow();
      focusInput();
    }
  });

  $("#prev").click(function() {
    //analogicznie do przycisku "next" jednak w drugą stronę. Zmniejszam wartość licznika, usuwam zawartość
    //formularza i zastępują ją polami z formularza poprzedniego. Warto tutaj zaznaczyć, że wartości wcześniej
    //wpisane zostały zapamiętane, a sam zabieg pozwala użytkownikowi zmienić wcześniej wprowadzone dane.
    counter--;
    checkCounter();
    refreshLeftMenu();
    setWindow();
    focusInput();
  });

  /*
    funkcja sprawdza numer okna i jeżeli numer jest większy od 0, to odblokowuje przycisk
    umożliwiający powrot do poprzedniego okna
  */

  checkCounter = function() {
    errorMessage.hide();
    /*
      uzupelnianie danych obiektu "user" za kazdym razem
      Dzięki takiemu posunięciu przy dodawaniu nowego kroku wystarczy:
        1.  Dodać treść kroku i input w tabeli "steps"
        2.  Dodać warunek, ktory sprawdza czy input istnieje
    */
    user.name     = ($("#userName").val())    ? $("#userName").val()    : user.name;
    user.surname  = ($("#userSurname").val()) ? $("#userSurname").val() : user.surname;
    user.address  = ($("#userAddress").val()) ? $("#userAddress").val() : user.address;
    user.phone    = ($("#userPhone").val())   ? $("#userPhone").val()   : user.phone;

    //blokowanie przyciskow "Poprzedni" i "Nastepny" wedle reguł
    if(counter === 0) {
      nextButton.show();
      showUserInfoButton.hide();
      nextButton.attr('disabled', false);
      prevButton.attr('disabled', true);
    }
    else if(counter === tab2.length - 1) {
      showUserInfoButton.show();
      prevButton.attr('disabled', false);
      nextButton.hide();
    }
    else {
      showUserInfoButton.hide();
      nextButton.show();
      prevButton.attr('disabled', false);
    }
  };

  showUserInfoButton.click(function() {
    if(!hasErrors("#userFormContainer form p input[type='text']")) {
      counter++;
      checkCounter();
      container.hide();

      userInfo.html("<h1>Wprowadzone dane</h1> " +
                    "<ul class='left'>" +
                    "<li>Imię:</li>" +
                    "<li>Nazwisko:</li>" +
                    "<li>Adres:</li>" +
                    "<li>Nr telefonu:</li>" +
                    "</ul>" +
                    "<ul class='right'>" +
                    "<li>" + user.name + "</li>" +
                    "<li>" + user.surname + "</li>" +
                    "<li>" + user.address + "</li>" +
                    "<li>" + user.phone + "</li>" +
                    "</ul>"
      );
      userInfo.show();
    }
  });

  /*
    Funkcja sprawdza czy dany formularz posiada jakieś błędy. Błąd jest zgłaszany, kiedy funkcja zwroci wartość
    true, ktora informuje system o tym, że ktoryś z validatorow nie przeszedł testu.
  */
  hasErrors = function(element) {
    //zmienna errorCounter zlicza błędy i na podstawie licznika decyduje jaką wartość zwrocić.
    var errorCounter = 0;

    $(element).each(function() {
      if(!$(this).val()) {
        if(tab2[counter].required) {
          errorMessage.text("Pole jest wymagane.");
          errorMessage.show();
          errorCounter++;
        }
      }
      else if(!tab2[counter].regex.test($(this).val())) {
        $(this).addClass("inputError");
        errorMessage.text("Użyto niedozwolonych znakow.");
        errorMessage.show();
        errorCounter++;
      }
    });

    //jeżeli funkcja hasErrors zwroci wartość "true", to przycisk "next" zwiększy wartość zmiennej "counter" o 1 i
    //wyświetli nowe pola formularza
    return (errorCounter === 0) ? false : true;
  };
});
