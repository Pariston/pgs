$().ready(function() {
  var nextButton                  = $("#next"),
      prevButton                  = $("#prev"),
      userFormContainer           = $("#userFormContainer"),
      showUserInfoButton          = $("#showUserInfoButton"),
      userNameContainer           = $("#userNameContainer").show(),
      userSurnameContainer        = $("#userSurnameContainer"),
      userAddressContainer        = $("#userAddressContainer"),
      userPhoneContainer          = $("#userPhoneContainer"),
      userInfo                    = $("#userInfo"),
      counter                     = 0; //zmienną kontroluję numer "okna". 0 - pierwsze okno

  var tab = [
    userNameContainer,
    userSurnameContainer,
    userAddressContainer,
    userPhoneContainer
  ];

  var tab2 = [
      {
        task: 'Podaj imie',
        input: '<input type="text" id="userName" />'
      },
      {
        task: 'Podaj nazwisko',
        input: '<input type="text" id="userSurname" />'
      },
      {
        task: 'Podaj adres',
        input: '<input type="text" id="userAddress" />'
      },
      {
        task: 'Podaj nr telefonu',
        input: '<input type="text" id="userPhone" />'
      }
  ];

  $("#userFormContainer form").submit(function(e) {
    return false;
  });

  $("#userFormContainer form").prepend(
    "<p>" + tab2[0].task +
    tab2[0].input + "</p>"
  );

  var user = {
    name:       String,
    surname:    String,
    address:    String,
    phone:      String
  };

  $("#next").click(function() {
    counter++;
    $("#userFormContainer form p").replaceWith(
      "<p>" + tab2[counter].task +
      tab2[counter].input + "</p>"
    );
    checkCounter();
  });

  $("#prev").click(function() {
    counter--;
    $("#userFormContainer form p").replaceWith(
      "<p>" + tab2[counter].task +
      tab2[counter].input + "</p>"
    );
    checkCounter();
  });

  /*
    funkcja sprawdza numer okna i jeżeli numer jest większy od 0, to odblokowuje przycisk
    umożliwiający powrot do poprzedniego okna
  */

  checkCounter = function() {
    //uzupelnianie danych obiektu "user" za kazdym razem
    user.name     = $("#userName").val();
    user.surname  = $("#userSurname").val();
    user.address  = $("#userAddress").val();
    user.phone    = $("#userPhone").val();

    //jeżeli okno ma numer licznika, to je pokazuje, a resztę okien chowa
    for(var i = 0; i < tab.length; i++) {
        if(counter === i) tab[i].show();
        else              tab[i].hide();
    }

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
    checkCounter();
    userFormContainer.hide();

    userInfo.html("Wprowadzone dane: " +
                  "Imię: " + user.name +
                  "<br />Nazwisko: " + user.surname +
                  "<br />Adres: " + user.address +
                  "<br />Nr telefonu: " + user.phone
    );
    userInfo.show();
  });
});
